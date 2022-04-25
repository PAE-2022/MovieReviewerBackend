import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  auth0Id: string;
}

const UserSchema = new Schema<IUser>({
  auth0Id: {
    type: String,
    required: true,
    unique: true,
  },
});

export const UserModel = model<IUser>('User', UserSchema);

export type User = IUser & Document;
