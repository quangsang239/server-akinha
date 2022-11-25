import { Schema, model } from "mongoose";

import { IAccommodation } from "../types/index";

const accommodationSchema = new Schema<IAccommodation>({
  userName: { type: String, required: true },
  stateRoom: Boolean,
  imageRoom: [String],
  addressRoom: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  nameRoom: String,
  area: Number,
  deposit: Number,
  aop: Number,
  utilities: [String],
  electricity: Number,
  water: Number,
  phoneNumber: String,
  name: String,
  category: String,
  sex: String,
  createAt: Date,
});
const accommodationModel = model<IAccommodation>(
  "accommodation",
  accommodationSchema
);
export default accommodationModel;
