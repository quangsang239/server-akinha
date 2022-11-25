import { Document } from "mongoose";
export interface IUser extends Document {
  email: string;
  name: string;
  phoneNumber: string;
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
export interface IAccommodation extends Document {
  userName: string;
  stateRoom: boolean;
  imageRoom: string[];
  addressRoom: string;
  latitude: number;
  longitude: number;
  price: number;
  nameRoom: string;
  area: number;
  deposit: number;
  aop: number;
  utilities: string[];
  electricity: number;
  water: number;
  phoneNumber: string;
  name: string;
  category: string;
  sex: string;
  createAt: Date;
}
