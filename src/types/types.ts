import type { Document } from 'mongoose';

export type TPayload = {
  id: string;
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

export type UserPublicData = {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
};
