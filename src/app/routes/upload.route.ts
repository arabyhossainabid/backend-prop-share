import { Role } from '@prisma/client';
import { Request, Response, Router } from 'express';
import status from 'http-status';
import { envVars } from '../config/env';
import AppError from '../errorHelpers/AppError';
import { checkAuth } from '../middleware/checkAuth';
import { upload } from '../middleware/upload';
import { catchAsync } from '../shared/catchAsync';
import { sendResponse } from '../shared/sendResponse';
import { cloudinaryUpload } from '../utils/cloudinary';

const router = Router();

router.post(
  '/',
  checkAuth(Role.USER, Role.ADMIN),
  upload.single('file'),
  catchAsync(async (req: Request, res: Response) => {
    if (envVars.NODE_ENV === 'development') {
      console.log('[UPLOAD] Request debug:', {
        contentType: req.headers['content-type'],
        body: req.body,
        file: req.file
          ? {
              fieldname: req.file.fieldname,
              originalname: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
              hasBuffer: Boolean(req.file.buffer),
            }
          : null,
      });
    }

    if (!req.file) {
      throw new AppError(
        status.BAD_REQUEST,
        'No file uploaded. Send multipart/form-data with a single file field named "file".'
      );
    }

    if (!req.file.buffer || req.file.buffer.length === 0) {
      throw new AppError(
        status.BAD_REQUEST,
        'Uploaded file buffer is missing before Cloudinary upload. Please retry with a valid image file.'
      );
    }

    let url = '';
    try {
      url = await cloudinaryUpload.uploadBuffer(req.file.buffer);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown Cloudinary upload error';
      throw new AppError(
        status.BAD_GATEWAY,
        `Cloudinary upload failed: ${errorMessage}. Check CLOUDINARY_* env config and upload payload.`
      );
    }

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: 'Image uploaded successfully',
      data: { url },
    });
  })
);

export const UploadRoutes: Router = router;
