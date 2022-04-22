import { ControllerError } from 'errors/controller-error';
import { NextFunction, Request, Response } from 'express';

export const catchErrors = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      next();
    } catch (e) {
      if (e instanceof ControllerError) {
        if (e.error) {
          console.error(`ControllerError`, e.error);
        }
        res.status(e.statusCode).json({
          message: e.message,
        });
      } else {
        console.error(`UnknownError`, e);
        res.status(500).json({
          message: 'Internal server error',
        });
      }
    }
  };
};
