import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { PropertyService } from './property.service';
import { IRequestUser } from '../../interfaces/requestUser.interface';

const createProperty = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyService.createProperty(req.body);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: 'Property listed successfully',
        data: result,
    });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
    const result = await PropertyService.getAllProperties(req.query);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Properties fetched successfully',
        data: result,
    });
});

const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await PropertyService.getSingleProperty(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Property details fetched successfully',
        data: result,
    });
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await PropertyService.updateProperty(id, req.body);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Property updated successfully',
        data: result,
    });
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await PropertyService.deleteProperty(id);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: 'Property deleted successfully',
    });
});

export const PropertyController = {
    createProperty,
    getAllProperties,
    getSingleProperty,
    updateProperty,
    deleteProperty,
};
