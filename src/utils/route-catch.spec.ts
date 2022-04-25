import { tryCatchHandler } from './route-catch';

describe('Route catch middleware', () => {
  it('Should catch error', async () => {
    // Arrange
    const error = new Error('Test error');
    const next = jest.fn();
    const req = {} as any;
    const res = {} as any;
    const send = jest.fn();
    const status = jest.fn().mockReturnValue({ send });
    res.status = status;

    // Act
    const handler = tryCatchHandler(async () => {
      throw error;
    });

    await handler(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(error);
  });
});
