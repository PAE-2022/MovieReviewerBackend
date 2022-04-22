export class ControllerError extends Error {
  public statusCode: number;
  public error?: Error;

  constructor(message: string, statusCode: number, error?: Error) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

export class BadRequestError extends ControllerError {
  constructor(message: string, error?: Error) {
    super(message, 400, error);
  }
}

export class UnauthorizedError extends ControllerError {
  constructor(message: string, error?: Error) {
    super(message, 401, error);
  }
}

export class ForbiddenError extends ControllerError {
  constructor(message: string, error?: Error) {
    super(message, 403, error);
  }
}

export class NotFoundError extends ControllerError {
  constructor(message: string, error?: Error) {
    super(message, 404, error);
  }
}

export class InternalServerError extends ControllerError {
  constructor(message: string, error?: Error) {
    super(message, 500, error);
  }
}
