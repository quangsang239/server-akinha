import { Schema, model } from "mongoose";

import { IAccommodation } from "../types/index";

const accommodationSchema = new Schema<IAccommodation>({
  userId: { type: String, required: true },
  stateRoom: String,
  imageRoom: [String],
  addressRoom: String,
  latitude: Number,
  longitude: Number,
  price: Number,
  phone: Number,
});
const accommodationModel = model<IAccommodation>(
  "accommodation",
  accommodationSchema
);
export default accommodationModel;
