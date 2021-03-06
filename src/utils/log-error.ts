import { HttpError } from '@errors/http-error';
import { NextFunction, Request, Response } from 'express';

export const logErrors = () => {
  return async (err: Error, _: Request, _1: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
      console.error(`HttpError`, err);
    } else {
      console.error(`Error`, err);
    }
    next(err);
  };
};
