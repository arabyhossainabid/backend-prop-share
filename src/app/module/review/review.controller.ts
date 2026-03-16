import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { ReviewService } from './review.service';
import { IRequestUser } from '../../interfaces/requestUser.interface';

const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = req.verifiedUser!;
    const result = await ReviewService.createReview(user.userId, req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: 'Review submitted successfully',
        data: result,
    });
});

const getPropertyReviews = catchAsync(async (req: Request, res: Response) => {
    const propertyId = req.params.propertyId as string;
    const result = await ReviewService.getPropertyReviews(propertyId);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Reviews fetched successfully',
        data: result,
    });
});

export const ReviewController = {
    createReview,
    getPropertyReviews
};
