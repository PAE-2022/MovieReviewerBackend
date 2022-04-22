import { CreateUserDto } from '@models/schemas/create-user';
import { UserModel } from '@models/user';
import { InternalServerError } from '../errors/controller-error';

export const createUser = async (createUserDto: CreateUserDto) => {
  const user = await UserModel.create({
    ...createUserDto,
  });
  if (!user) {
    throw new InternalServerError('User not created');
  }

  return user;
};
