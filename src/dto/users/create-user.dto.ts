import { IsDate, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateUserDto:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          description: User email
 *          format: email
 *        name:
 *          type: string
 *          description: User name
 *        dateOfBirth:
 *          type: string
 *          description: User date of birth
 *          format: date-time
 *        password:
 *          type: string
 *          description: User password
 *          minLength: 8
 */
export class CreateUserDto {
  @IsEmail(undefined)
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  name: string;

  @IsDate()
  dateOfBirth: Date;
}
