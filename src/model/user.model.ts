import { Schema, model } from "mongoose";

import { IUser } from "../types/index";

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  userName: { type: String, required: true },
  password: String,
  refreshToken: String,
  verified: String,
});
const UserModel = model<IUser>("user", userSchema);
export default UserModel;
