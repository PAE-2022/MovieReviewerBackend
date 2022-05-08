import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateCommentDto:
 *      type: object
 *      properties:
 *        comment:
 *          type: string
 *          description: Comment content
 *          maxLength: 255
 *          minLength: 1
 */
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  comment: string;
}
