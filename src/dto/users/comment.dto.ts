/**
 * @swagger
 * components:
 *  schemas:
 *    CommentDto:
 *      type: object
 *      properties:
 *        content:
 *          type: string
 *          description: Comment content
 *        movieName:
 *          type: string
 *          description: Movie name
 *        moviePicture:
 *          type: string
 *          description: Movie picture
 */
export class CommentDto {
  content: string;
  movieName: string;
  moviePicture: string;
}
