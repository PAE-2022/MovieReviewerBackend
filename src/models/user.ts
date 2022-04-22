import { Schema, model, Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IsSchemaOptions } from 'joi';

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  dateOfBirth: Date;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  googleId?: string;
  facebookId?: string;
  profileUrl: string;

  verifyPassword(password: string): Promise<boolean>;
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
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  googleId: {
    type: String,
    required: false,
    unique: true,
  },
  facebookId: {
    type: String,
    required: false,
    unique: true,
  },
  profileUrl: {
    type: String,
    required: false,
  },
});

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

UserSchema.methods.verifyPassword = async function (
  password: string,
): Promise<boolean> {
  const compare = await bcrypt.compare(password, this.password);

  return compare;
};

export const UserModel = model<IUser>('User', UserSchema);
const a = new UserModel();

export type User = IUser & Document;
