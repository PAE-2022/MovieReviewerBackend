import { IsIn, IsNumber } from 'class-validator';

/**
 * @swagger
 * components:
 *  schemas:
 *    RateMovieDto:
 *      type: object
 *      properties:
 *        score:
 *          type: integer
 *          description: Score of the movie
 *          format: int32
 *          minimum: 1
 *          maximum: 5
 */
export class RateMovieDto {
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  score: number;
}
