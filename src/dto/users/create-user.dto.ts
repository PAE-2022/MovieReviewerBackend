import { IsDate, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
