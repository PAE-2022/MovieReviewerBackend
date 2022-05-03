import { BadRequestError } from '@errors/http-error';
import { NextFunction, Request, Response } from 'express';
import { validate as classValidate } from 'class-validator';

export function validate<T>(type: { new (): T }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const object = new type();
    Object.assign(object, req.body);
    const errors = await classValidate(type);
    if (errors.length > 0) {
      throw new BadRequestError({
        message: 'Validation failed',
        errors: errors.map((error) => error.constraints),
      });
    }

    next();
  };
}
