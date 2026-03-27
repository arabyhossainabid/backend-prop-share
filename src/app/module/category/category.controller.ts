import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { CategoryService } from './category.service';

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getAllCategories();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Categories fetched',
    data: result,
  });
});

export const CategoryController = {
  getAllCategories,
};
