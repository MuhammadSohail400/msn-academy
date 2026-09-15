import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { User } from '../modules/users/user.model';
import { hashPassword } from '../utils/password';
import { logger } from '../utils/logger';

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in environment variables');
    }

    logger.info('Connecting to MongoDB for admin seeding...');
    await mongoose.connect(mongoUri);

    const adminEmail = 'admin@msnacademy.pk';
    const adminPassword = 'Pakistan@12345';
    const hashedPassword = await hashPassword(adminPassword);

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      logger.info(`Admin user [${adminEmail}] already exists. Updating role & credentials...`);
      admin.role = 'ADMIN';
      admin.isEmailVerified = true;
      admin.passwordHash = hashedPassword;
      await admin.save();
    } else {
      logger.info(`Creating initial admin user [${adminEmail}]...`);
      admin = await User.create({
        fullName: 'MSN Academy Super Admin',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isEmailVerified: true,
        phoneNumber: '+923001234567',
      });
    }

    logger.info({
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
    }, '✅ Admin user successfully seeded/updated!');

    process.exit(0);
  } catch (error) {
    logger.error({ error }, '❌ Admin seeding failed:');
    process.exit(1);
  }
}

seedAdmin();
