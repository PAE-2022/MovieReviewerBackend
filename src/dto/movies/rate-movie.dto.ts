import { IsIn, IsNumber } from 'class-validator';

export class RateMovieDto {
  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  score: number;
}
