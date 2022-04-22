import { BadRequestError } from 'errors/controller-error';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export function validate<T>(schema: Joi.ObjectSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { error } = await schema.validateAsync(req.body);

    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    await next();
  };
}
