import { Schema, model } from "mongoose";

import { IUserVerification } from "../types/index";

const userVerificationSchema = new Schema<IUserVerification>({
  userId: { type: String, required: true },
  uniqueString: { type: String, required: true },
  createdAt: Date,
  expiresAt: Date,
});
const UserVerifiCationModel = model<IUserVerification>(
  "userVerification",
  userVerificationSchema
);

export default UserVerifiCationModel;
