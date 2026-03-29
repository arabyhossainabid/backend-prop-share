import { Request, Response } from 'express';
import status from 'http-status';
import { catchAsync } from '../../shared/catchAsync';
import { sendResponse } from '../../shared/sendResponse';
import { ContactService } from './contact.service';

const submitMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.createMessage(req.body, req.verifiedUser);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: 'Your message has been sent successfully',
    data: result,
  });
});

const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.getAllMessages(req.query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Contact inbox fetched successfully',
    data: result,
  });
});

const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.deleteMessage(req.params.id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Contact thread deleted successfully',
    data: result,
  });
});

const deleteMyMessage = catchAsync(async (req: Request, res: Response) => {
  const user = req.verifiedUser!;
  const result = await ContactService.deleteMyMessage(req.params.id as string, user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Your message thread has been deleted',
    data: result,
  });
});

const getMyMessages = catchAsync(async (req: Request, res: Response) => {
  const user = req.verifiedUser!;
  const result = await ContactService.getMyMessages(user.userId);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'My contact threads fetched successfully',
    data: result,
  });
});

const getReplies = catchAsync(async (req: Request, res: Response) => {
  const user = req.verifiedUser!;
  const result = await ContactService.getReplies(
    req.params.contactId as string,
    user
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: 'Replies fetched successfully',
    data: result,
  });
});

export const ContactController = {
  submitMessage,
  getAllMessages,
  deleteMessage,
  deleteMyMessage,
  getMyMessages,
  getReplies,
};
