import { Schema, model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { IMovie } from './movie';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  dateOfBirth: Date;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  following: IUser[] | string[] | ObjectId[];
  favorites: IMovie[] | string[] | ObjectId[];

  isValidPassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  following: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    default: [],
  },
  favorites: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
      },
    ],
    default: [],
  },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

UserSchema.methods.isValidPassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export const UserModel = model<IUser>('User', UserSchema);

export type User = IUser & Document;
