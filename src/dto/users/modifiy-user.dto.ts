import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

/**
 * @swagger
 * components:
 *  schemas:
 *    ModifyUserDto:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: User name
 *          required: false
 *        password:
 *          type: string
 *          description: User password
 *          required: false
 */
export class ModifyUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string | undefined;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(8)
  password: string | undefined;
}
