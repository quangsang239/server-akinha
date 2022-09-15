import { Schema, model } from "mongoose";

import { IUser } from "src/types";

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  userName: { type: String, required: true },
  password: String,
  token: String,
});
const UserModel = model<IUser>("user", userSchema);
export default UserModel;
