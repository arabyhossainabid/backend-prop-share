import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { catchAsync } from '../shared/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedData = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });

    if (parsedData.body !== undefined) {
      req.body = parsedData.body;
    }

    if (parsedData.query !== undefined) {
      req.query = parsedData.query;
    }

    if (parsedData.params !== undefined) {
      req.params = parsedData.params;
    }

    if (parsedData.cookies !== undefined) {
      req.cookies = parsedData.cookies;
    }

    next();
  });
};

export default validateRequest;
