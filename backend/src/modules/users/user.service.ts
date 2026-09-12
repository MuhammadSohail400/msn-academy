import { User, IUser } from './user.model';
import { hashPassword, verifyPassword } from '../../utils/password';
import { ApiError } from '../../utils/ApiError';
import { UpdateProfileInput, ChangePasswordInput } from './user.validation';

export class UserService {
  /**
   * Fetch current user profile document by ID.
   */
  public static async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }
    return user;
  }

  /**
   * Update student profile fields (name, phone, avatar).
   */
  public static async updateProfile(userId: string, input: UpdateProfileInput): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }

    if (input.fullName !== undefined) user.fullName = input.fullName;
    if (input.phoneNumber !== undefined) user.phoneNumber = input.phoneNumber;
    if (input.avatarUrl !== undefined) user.avatarUrl = input.avatarUrl;

    await user.save();
    return user;
  }

  /**
   * Change user account password after validating the current password.
   */
  public static async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw ApiError.notFound('User account not found.');
    }

    const isCurrentValid = await verifyPassword(user.passwordHash, input.currentPassword);
    if (!isCurrentValid) {
      throw ApiError.badRequest('Current password provided is incorrect.');
    }

    user.passwordHash = await hashPassword(input.newPassword);
    await user.save();
  }
}

export default UserService;
