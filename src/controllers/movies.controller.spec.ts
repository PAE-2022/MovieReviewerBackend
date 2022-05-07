import { newAverageFromPrecomputed } from './movies.controller';

describe('Moies controller', () => {
  it('Should calculate new average when adding', async () => {
    // Numbers after adding the last score of 5
    const numbers = [3, 2, 3, 5, 3, 2, 5, 5, 2];
    // 3.5
    const expectedAverage = 3.5;
    // 3.33333333
    const previousAverage = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const newScore = 5;

    // Calculate average
    const average = newAverageFromPrecomputed(
      5,
      previousAverage,
      numbers.length,
    );

    expect(average).toBe(expectedAverage);
  });

  it('Should calculate new average when modifying', async () => {
    // Array was the same as the previous step, but we modify the last 5 to be 2
    const numbers = [3, 2, 3, 5, 3, 2, 5, 5, 2, 5];
    const expectedAverage = 3.2;
    // 3.2
    const previousAverage = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const newScore = 2;
    const previousScore = 5;

    // Calculate average
    const average = newAverageFromPrecomputed(
      newScore,
      previousAverage,
      numbers.length,
      previousScore,
    );

    expect(average).toBe(expectedAverage);
  });
});
