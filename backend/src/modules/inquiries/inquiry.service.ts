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

  /**
   * Admin: Retrieves paginated contact inquiries.
   */
  public static async getAllAdminInquiries(query: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.status && query.status !== 'ALL') {
      filter.status = query.status.toUpperCase();
    }
    if (query.search && query.search.trim()) {
      const regex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { subject: regex },
      ];
    }

    const [inquiries, total] = await Promise.all([
      ContactInquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactInquiry.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      inquiries: inquiries.map((inq: any) => ({
        id: inq._id.toString(),
        fullName: inq.fullName,
        email: inq.email,
        phone: inq.phone || 'N/A',
        subject: inq.subject,
        message: inq.message,
        status: inq.status,
        createdAt: inq.createdAt ? inq.createdAt.toISOString() : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Admin: Updates the status of an inquiry.
   */
  public static async updateInquiryStatus(
    inquiryId: string,
    status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED'
  ): Promise<IContactInquiry> {
    const inquiry = await ContactInquiry.findById(inquiryId);
    if (!inquiry) {
      throw new Error('Inquiry not found');
    }
    inquiry.status = status;
    await inquiry.save();
    return inquiry;
  }
}
