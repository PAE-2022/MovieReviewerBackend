import { IsMongoId } from 'class-validator';

/**
 * @swagger
 * components:
 *  schemas:
 *    FollowDto:
 *      type: object
 *      properties:
 *        userId:
 *          type: string
 *          description: User id to follow
 *          format: ObjectId
 */
export class FollowDto {
  @IsMongoId()
  userId: string;
}
