import { Document } from "mongoose";
export interface IUser extends Document {
  email: string;
  userName: string;
  password: string;
  refreshToken: string;
  verified: boolean;
}
export interface IUserVerification extends Document {
  userId: string;
  uniqueString: string;
  createdAt: Date;
  expiresAt: Date;
}
