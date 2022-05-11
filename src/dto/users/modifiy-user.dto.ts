import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
 *          required: true
 */
export class ModifyUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string | undefined;
}
