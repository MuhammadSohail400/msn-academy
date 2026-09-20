import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { User, IUser } from '../users/user.model';
import { hashPassword, verifyPassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';
import { RegisterInput, LoginInput } from './auth.validation';

const googleClient = new OAuth2Client();

export interface AuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
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

    const user = await User.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      passwordHash: hashedPassword,
      role: 'STUDENT',
      phoneNumber: input.phoneNumber,
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

    return { user, accessToken, refreshToken };
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
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration
    await user.save({ validateBeforeSave: false });

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
