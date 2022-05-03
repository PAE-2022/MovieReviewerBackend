import { Schema, model, Document } from 'mongoose';
import { Movie } from './movie';
import { User } from './user';

interface IComment extends Document {
  belongsTo: Movie;
  createdBy: User;
  content: string;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IComment>({
  belongsTo: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  createdBy: {
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

UserSchema.pre<IComment>('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
export const CommentModel = model<IComment>('User', UserSchema);

export type Comment = IComment & Document;
