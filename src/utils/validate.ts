import { BadRequestError } from 'errors/controller-error';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export function validate<T>(schema: Joi.ObjectSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
    } catch (e) {
      next(new BadRequestError(e, e.message));
      return;
    }

    next();
  };
}
