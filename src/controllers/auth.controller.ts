import { User } from '@models/user';

export const signToken = async (user: User) => {
  const token = await user.veri;

  return token;
};
