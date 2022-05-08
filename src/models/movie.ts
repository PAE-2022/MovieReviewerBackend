import { ObjectId } from 'mongodb';
import { Schema, model, Document } from 'mongoose';
import { Comment } from './comments';

/**
 * @swagger
 * components:
 *  schemas:
 *    Platform:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Platform of the movie
 *        url:
 *          type: string
 *          description: Url of the movie
 *          format: url
 */
interface IPlatform {
  name: string;
  url: string;
}

interface IMovieReviewScore {
  score: number;
  user: ObjectId | string;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    Movie:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *        name:
 *          type: string
 *          description: Movie title
 *        cover:
 *          type: string
 *          description: Movie cover
 *          format: url
 *        synopsis:
 *          type: string
 *          description: Movie synopsis
 *        trailer:
 *          type: string
 *          description: Movie trailer
 *          format: url
 *        score:
 *          type: number
 *          description: Movie score
 *        releaseDate:
 *          type: string
 *          description: Movie release date
 *          format: date-time
 *        platforms:
 *          type: array
 *          items:
 *           $ref: '#/components/schemas/Platform'
 *          description: Movie platforms
 *        screenWriters:
 *          type: array
 *          items:
 *            type: string
 *          description: Movie screen writers
 *        cast:
 *          type: array
 *          items:
 *            type: string
 *          description: Movie cast
 *        genres:
 *          type: array
 *          items:
 *            type: string
 *          description: Movie genres
 *        comments:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Comment'
 *          description: Movie comments
 */
export interface IMovie extends Document {
  name: string;
  cover: string;
  synopsis: string;
  trailer: string;
  scores: IMovieReviewScore[];
  score: number;
  releaseDate: Date;
  platforms: IPlatform[];
  screenwriters: string[];
  cast: string[];
  genres: string[];
  comments: Comment[];

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
  scores: {
    type: [
      {
        score: Number,
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    required: true,
    default: [],
  },
  score: {
    type: Number,
    required: true,
    default: 0,
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
  comments: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    default: [],
  },
});

UserSchema.pre<IMovie>('save', async function (next) {
  this.updatedAt = new Date();
  next();
});
export const MovieModel = model<IMovie>('Movie', UserSchema);

export type Movie = IMovie & Document;
