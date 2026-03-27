import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { NewsletterService } from './newsletter.service';

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterService.subscribe(req.body.email);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Successfully subscribed to our newsletter!',
    data: result,
  });
});

export const NewsletterController = {
  subscribe,
};
