import { IAccommodation } from "../types";
import AccommodationModel from "../model/accommodation.model";
import { Request, Response, NextFunction } from "express";

let getAllAccommodation = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const AllAccommodation: IAccommodation[] = await AccommodationModel.find(
    {}
  ).exec();
  res.status(200).json(AllAccommodation);
};
let createAccommodation = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const {
    userId,
    stateRoom,
    imageRoom,
    addressRoom,
    latitude,
    longitude,
    price,
    phone,
  }: IAccommodation = req.body;
  await AccommodationModel.create({
    userId,
    stateRoom,
    imageRoom,
    addressRoom,
    latitude,
    longitude,
    price,
    phone,
  })
    .then(() => {
      res
        .status(200)
        .json({ code: 0, message: "Create Accommodation successfully!" });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ code: 1, message: "Create Accommodation failed!" });
      console.log(error);
    });
};
let getAccommodationById = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { userId } = req.params;
  const listAccommodation: IAccommodation[] = await AccommodationModel.find({
    userId,
  }).exec();
  res.status(200).json(listAccommodation);
};
export default {
  getAllAccommodation,
  createAccommodation,
  getAccommodationById,
};
