import { UserModel } from '@models/user';
import { InternalServerError } from '../errors/controller-error';
import { createHash } from 'crypto';
import { UserDto } from '@dto/users/user.dto';
import { CreateUserDto } from '@dto/users/create-user.dto';

export class UserController {
  public async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    // calculate gravatar hash as default profile image
    const gravatarHash = createHash('md5')
      .update(createUserDto.email.trim().toLowerCase())
      .digest('hex');
    const user = await UserModel.create({
      ...createUserDto,
      profileUrl: `https://www.gravatar.com/avatar/${gravatarHash}`,
    });
    if (!user) {
      throw new InternalServerError({
        message: 'User not created',
      });
    }

    return new UserDto(user);
  }
}
