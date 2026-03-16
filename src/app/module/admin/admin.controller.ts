import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { AdminService } from './admin.service';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAllUsers();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Users fetched successfully',
        data: result,
    });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await AdminService.updateUser(id, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});

const reviewProperty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status: propStatus } = req.body;
    const result = await AdminService.reviewProperty(id, propStatus);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Property status updated',
        data: result,
    });
});

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getPlatformAnalytics();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Analytics fetched successfully',
        data: result,
    });
});

export const AdminController = {
    getAllUsers,
    updateUser,
    reviewProperty,
    getAnalytics,
};
