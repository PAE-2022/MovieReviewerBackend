import { Schema, model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { IMovie } from './movie';

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: User's unique identifier
 *        email:
 *          type: string
 *          description: User email
 *          format: email
 *        name:
 *          type: string
 *          description: User name
 *        dateOfBirth:
 *          type: string
 *          description: User date of birth
 *          format: date-time
 *        avatar:
 *          type: string
 *          description: User avatar
 *          format: url
 *        following:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/User'
 *        favorites:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Movie'
 */
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

UserSchema.index({
  email: 'text',
  name: 'text',
});

UserSchema.pre<IUser>('validate', async function (next) {
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

// Delete user password after serialization
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const UserModel = model<IUser>('User', UserSchema);

export type User = IUser & Document;
