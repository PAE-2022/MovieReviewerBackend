import { IsDefined, IsMongoId } from 'class-validator';

/**
 * @swagger
 * components:
 *  schemas:
 *    AddToFavoritesDto:
 *      type: object
 *      properties:
 *        movieId:
 *          type: string
 *          description: Movie id
 *          format: ObjectId
 */
export class AddToFavoritesDto {
  @IsMongoId()
  @IsDefined()
  movieId: string;
}
