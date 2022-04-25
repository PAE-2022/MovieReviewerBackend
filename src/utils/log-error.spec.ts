import { BadRequestError } from '@errors/controller-error';
import { logErrors } from './log-error';

describe('Log errors middleware', () => {
  it('Should log generic error', () => {
    // Arrange
    const error = new Error('Test error');
    const next = jest.fn();
    const req = {} as any;
    const res = {} as any;
    console.error = jest.fn();

    // Act
    logErrors()(error, req, res, next);

    // Assert
    expect(console.error).toHaveBeenCalledWith('Error', error);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('Should log HttpError', () => {
    // Arrange
    const error = new BadRequestError({});
    const next = jest.fn();
    const req = {} as any;
    const res = {} as any;
    console.error = jest.fn();

    // Act
    logErrors()(error, req, res, next);

    // Assert
    expect(console.error).toHaveBeenCalledWith('HttpError', error);
    expect(next).toHaveBeenCalledWith(error);
  });
});
