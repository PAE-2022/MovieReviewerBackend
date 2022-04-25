import { User } from '@models/user';

export class UserDto {
  id: string;
  email: string;
  name: string;
  dateOfBirth: Date;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  facebookId?: string;
  profileUrl: string;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.dateOfBirth = user.dateOfBirth;
    this.avatar = user.avatar;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.googleId = user.googleId;
    this.facebookId = user.facebookId;
    this.profileUrl = user.profileUrl;
  }
}
