import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../users/user.model';
import { hashPassword, verifyPassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';
import { RegisterInput, LoginInput } from './auth.validation';
import { env } from '../../config/environment';
import { logger } from '../../utils/logger';
import { emailService } from '../email/email.service';

const googleClient = new OAuth2Client();

export interface AuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  verificationCode?: string;
}

export class AuthService {
  /**
   * Register a new student user and generate authentication session tokens.
   */
  public static async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists. Please sign in instead.');
    }

    const hashedPassword = await hashPassword(input.password);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedVerificationCode = crypto.createHash('sha256').update(verificationCode).digest('hex');

    const user = await User.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      passwordHash: hashedPassword,
      role: 'STUDENT',
      phoneNumber: input.phoneNumber,
      isEmailVerified: false,
      emailVerificationCode: hashedVerificationCode,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Asynchronously dispatch email verification code
    emailService
      .sendVerificationEmail(
        user.email,
        user.fullName,
        verificationCode,
        `${env.CLIENT_URL}/verify-email?email=${encodeURIComponent(user.email)}&code=${verificationCode}`
      )
      .catch((err) => {
        logger.error({ err: err.message }, 'Failed to dispatch registration verification email');
      });

    const accessToken = signAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const refreshToken = signRefreshToken({
      id: user._id.toString(),
    });

    return {
      user,
      accessToken,
      refreshToken,
      verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined,
    };
  }

  /**
   * Authenticate a student or admin user with credentials.
   */
  public static async login(input: LoginInput): Promise<AuthResult> {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (!user.passwordHash) {
      throw ApiError.unauthorized('This account was created using Google Sign-In. Please sign in with Google.');
    }

    const isMatch = await verifyPassword(user.passwordHash, input.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const accessToken = signAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const refreshToken = signRefreshToken({
      id: user._id.toString(),
    });

    return { user, accessToken, refreshToken };
  }

  /**
   * Retrieve current authenticated user profile.
   */
  public static async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User session not found.');
    }
    return user;
  }

  /**
   * Initiate forgot password flow by creating a secure time-bounded reset token.
   */
  public static async forgotPassword(email: string): Promise<{ resetToken?: string }> {
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return {};
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
    await user.save({ validateBeforeSave: false });

    // Send password reset email asynchronously
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
    emailService
      .sendPasswordResetEmail(user.email, user.fullName, resetUrl)
      .catch((err) => {
        logger.error({ err: err.message }, 'Failed to dispatch password reset email');
      });

    return { resetToken: rawToken };
  }

  /**
   * Reset user password using verified reset token.
   */
  public static async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordHash');

    if (!user) {
      throw ApiError.badRequest('Password reset token is invalid or has expired.');
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
  }

  /**
   * Verifies user email with 6-digit OTP code.
   */
  public static async verifyEmail(email: string, code: string): Promise<void> {
    const hashedCode = crypto.createHash('sha256').update(code.trim()).digest('hex');

    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationCode: hashedCode,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired verification code.');
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email after email verification
    emailService
      .sendWelcomeEmail(user.email, user.fullName, `${env.CLIENT_URL}/dashboard`)
      .catch((err) => {
        logger.error({ err: err.message }, 'Failed to dispatch welcome email');
      });
  }

  /**
   * Resends fresh 6-digit email verification code.
   */
  public static async resendVerification(email: string): Promise<{ code?: string }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return quietly to prevent email enumeration
      return {};
    }

    if (user.isEmailVerified) {
      throw ApiError.badRequest('This account is already verified.');
    }

    const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash('sha256').update(rawCode).digest('hex');

    user.emailVerificationCode = hashedCode;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    emailService
      .sendVerificationEmail(
        user.email,
        user.fullName,
        rawCode,
        `${env.CLIENT_URL}/verify-email?email=${encodeURIComponent(user.email)}&code=${rawCode}`
      )
      .catch((err) => {
        logger.error({ err: err.message }, 'Failed to dispatch verification email');
      });

    return {
      code: process.env.NODE_ENV === 'development' ? rawCode : undefined,
    };
  }

  /**
   * Refresh expired access token using valid refresh token.
   */
  public static async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        throw ApiError.unauthorized('Session invalid or user no longer exists.');
      }

      const accessToken = signAccessToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      });

      return { accessToken };
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token. Please sign in again.');
    }
  }

  /**
   * Authenticate or register a user via Google OAuth ID Token.
   */
  public static async googleOAuth(idToken: string): Promise<AuthResult> {
    let email: string = '';
    let fullName: string = 'Google User';
    let avatarUrl: string | undefined;
    let googleId: string | undefined;

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (clientId && idToken !== 'mock_google_token') {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: clientId,
        });
        const payload = ticket.getPayload();
        if (payload && payload.email) {
          email = payload.email;
          fullName = payload.name || payload.given_name || (email ? email.split('@')[0] : 'Google User');
          avatarUrl = payload.picture;
          googleId = payload.sub;
        }
      } catch (err: any) {
        throw ApiError.badRequest('Invalid or expired Google token: ' + (err.message || 'Verification failed'));
      }
    } else {
      // Fallback decoding for development/testing
      try {
        const parts = idToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          email = payload.email || '';
          fullName = payload.name || payload.given_name || (email ? email.split('@')[0] : 'Google User');
          avatarUrl = payload.picture;
          googleId = payload.sub;
        }
      } catch {
        // Ignore parse failure and fall back if dev
      }
    }

    if (!email && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' || !process.env.NODE_ENV)) {
      email = 'google.oauth.student@msnacademy.pk';
      fullName = 'Google Student';
      googleId = 'mock-google-id-12345';
    }

    if (!email) {
      throw ApiError.badRequest('Invalid Google ID Token: unable to extract email address.');
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        fullName,
        email: email.toLowerCase(),
        role: 'STUDENT',
        isEmailVerified: true,
        avatarUrl,
        googleId,
        authProvider: 'GOOGLE',
        isGoogleOAuth: true,
      });
    } else {
      let changed = false;
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        changed = true;
      }
      if (!user.avatarUrl && avatarUrl) {
        user.avatarUrl = avatarUrl;
        changed = true;
      }
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        changed = true;
      }
      if (!user.isGoogleOAuth) {
        user.isGoogleOAuth = true;
        changed = true;
      }
      if (changed) {
        await user.save();
      }
    }

    const accessToken = signAccessToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const refreshToken = signRefreshToken({
      id: user._id.toString(),
    });

    return { user, accessToken, refreshToken };
  }
}

export default AuthService;
