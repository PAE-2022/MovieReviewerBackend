import Joi from 'joi';

export class CreateUserDto {
  email: string;
  password: string;
  name: string;
  dateOfBirth: Date;
}

export const createUserSchema = Joi.object<CreateUserDto>({
  email: Joi.string().email(),
  dateOfBirth: Joi.date(),
  name: Joi.string(),
  password: Joi.string().min(8),
});
