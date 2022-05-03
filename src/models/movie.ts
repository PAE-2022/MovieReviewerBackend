import { Schema, model, Document } from 'mongoose';

interface IPlatform {
  name: string;
  url: string;
}

interface IMovie extends Document {
  name: string;
  cover: string;
  synopsis: string;
  trailer: string;
  score: number;
  releaseDate: Date;
  platforms: IPlatform[];
  screenwriters: string[];
  cast: string[];
  genres: string[];

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IMovie>({
  name: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  trailer: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  platforms: {
    type: [
      {
        name: String,
        url: String,
      },
    ],
    required: true,
  },
  screenwriters: {
    type: [String],
    required: true,
  },
  cast: {
    type: [String],
    required: true,
  },
  genres: {
    type: [String],
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
});

UserSchema.pre<IMovie>('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
export const MovieModel = model<IMovie>('User', UserSchema);

export type Movie = IMovie & Document;
