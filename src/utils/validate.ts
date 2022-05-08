import { BadRequestError } from '@errors/http-error';
import { NextFunction, Request, Response } from 'express';
import { validate as classValidate } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/ban-types
export function validate<T extends Object>(type: { new (): T }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const object = new type();
    Object.assign(object, req.body);
    const errors = await classValidate(object);
    if (errors.length > 0) {
      next(
        new BadRequestError({
          message: 'Validation failed',
          errors: errors.map((error) => error.constraints),
        }),
      );
    }

    next();
  };
}
