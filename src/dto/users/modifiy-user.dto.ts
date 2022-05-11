import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ModifyUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string | undefined;
}
