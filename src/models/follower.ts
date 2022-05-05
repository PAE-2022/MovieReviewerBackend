import { Schema, model, Document } from 'mongoose';
import { User } from './user';

export interface IFollower extends Document {
  from: User;
  user: User;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IFollower>({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

UserSchema.pre<IFollower>('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
export const FollowerModel = model<IFollower>('Follower', UserSchema);

export type Follower = IFollower & Document;
