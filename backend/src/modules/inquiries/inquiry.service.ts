import { ContactInquiry, IContactInquiry } from './inquiry.model';
import { CreateInquiryInput } from './inquiry.validation';
import { logger } from '../../utils/logger';
import { emailService } from '../email/email.service';

export class InquiryService {
  /**
   * Records a new contact inquiry from prospective learners and dispatches emails.
   */
  public static async createInquiry(input: CreateInquiryInput): Promise<{ inquiryId: string }> {
    const inquiry = await ContactInquiry.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || null,
      subject: input.subject,
      message: input.message,
      status: 'NEW',
    });

    logger.info(
      { inquiryId: inquiry._id.toString(), email: inquiry.email, subject: inquiry.subject },
      '📬 New contact inquiry received'
    );

    // Dispatch auto-reply to visitor & lead alert to admin (awaited for serverless runtime stability)
    try {
      await emailService.handleContactInquiry({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        message: input.message,
      });
    } catch (err: any) {
      logger.error({ err: err.message }, 'Failed to dispatch contact inquiry emails');
    }

    return {
      inquiryId: inquiry._id.toString(),
    };
  }
}
