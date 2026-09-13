import { ContactInquiry, IContactInquiry } from './inquiry.model';
import { CreateInquiryInput } from './inquiry.validation';
import { logger } from '../../utils/logger';

export class InquiryService {
  /**
   * Records a new contact inquiry from prospective learners.
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

    return {
      inquiryId: inquiry._id.toString(),
    };
  }
}
