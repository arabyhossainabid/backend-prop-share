import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { ContentService } from './content.service';

const getContentBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await ContentService.getContentBySlug(
    req.params.slug as string
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Content retrieved successfully',
    data: result,
  });
});

export const ContentController = {
  getContentBySlug,
};
