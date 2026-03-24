import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import status from 'http-status';
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

const getAllSubscribers = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterService.getAllSubscribers();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Subscribers fetched successfully',
        data: result,
    });
});

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
    const result = await NewsletterService.unsubscribe(req.body.email);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Successfully unsubscribed from our newsletter',
        data: result,
    });
});

export const NewsletterController = {
    subscribe,
    getAllSubscribers,
    unsubscribe,
};
