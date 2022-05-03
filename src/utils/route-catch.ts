import { BadRequestError, HttpError } from '@errors/http-error';
import { MongoError } from 'mongodb';
import { NextFunction, Request, Response } from 'express';

export const tryCatchHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (e) {
      if (e instanceof MongoError && e.code === 11000) {
        // Duplicate
        next(
          new BadRequestError(
            {
              message: 'Duplicate object',
            },
            e,
          ),
        );
      } else {
        next(e);
      }
    }
  };
};

export const errorHandler = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (e: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (e) {
      if (e instanceof HttpError) {
        res.status(e.statusCode).json(e.response);
      } else {
        res.status(500).json({
          message: 'Internal server error',
        });
      }
    }
  };
};
