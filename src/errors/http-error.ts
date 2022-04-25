export class HttpError extends Error {
  public statusCode: number;
  public error?: Error;
  public response: object;

  constructor(response: object, statusCode: number, error?: Error) {
    super('HttpError');
    this.response = response;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export class BadRequestError extends HttpError {
  constructor(response: object, error?: Error) {
    super(response, 400, error);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(response: object, error?: Error) {
    super(response, 401, error);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: object, error?: Error) {
    super(message, 403, error);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: object, error?: Error) {
    super(message, 404, error);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: object, error?: Error) {
    super(message, 500, error);
  }
}
