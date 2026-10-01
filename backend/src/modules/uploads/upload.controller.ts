import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiError } from '../../utils/ApiError';

export class UploadController {
  /**
   * POST /api/v1/uploads
   * Accepts multipart/form-data with a single file under key 'file'
   */
  public static async uploadSingle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.file) {
        throw ApiError.badRequest('No file was provided for upload.');
      }

      const folder = (req.query.folder as string) || 'general';
      const relativeUrl = `/uploads/${folder}/${req.file.filename}`;
      const protocol = req.protocol;
      const host = req.get('host');
      const fullUrl = `${protocol}://${host}${relativeUrl}`;

      res.status(201).json(
        ApiResponse.created(
          {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            sizeBytes: req.file.size,
            url: relativeUrl,
            fullUrl,
          },
          'File uploaded successfully.'
        )
      );
    } catch (error) {
      next(error);
    }
  }
}
