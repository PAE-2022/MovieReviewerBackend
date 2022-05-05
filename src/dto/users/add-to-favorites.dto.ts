import { IsDefined, IsMongoId } from 'class-validator';

export class AddToFavoritesDto {
  @IsMongoId()
  @IsDefined()
  movieId: string;
}
