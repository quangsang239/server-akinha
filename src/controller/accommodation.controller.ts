import { IAccommodation } from "../types";
import AccommodationModel from "../model/accommodation.model";
import { Request, Response, NextFunction } from "express";
import data from "../data/data.json";

let getLocation = (_req: Request, res: Response) => {
  res.status(200).json(data);
};

let getAllAccommodation = (_req: Request, res: Response) => {
  AccommodationModel.find({})
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ code: 1, message: "server error!" });
    });
};

let getPageAccommodation = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const page = parseInt(req.params.page);
  console.log(page);

  const PAGE_SIZE = 4;
  if (page) {
    const totalDocument = await AccommodationModel.countDocuments().exec();
    AccommodationModel.find({})
      .skip((page - 1) * PAGE_SIZE)
      .limit(4)
      .then((data) => {
        res.status(200).json({ totalDocument, data });
      })
      .catch((error) => {
        console.log(error);

        res.status(400).json({ code: 1, message: "server error!" });
      });
  } else {
    res.status(400).json({ code: 1, message: "server error!" });
  }
};
let createAccommodation = (
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
  AccommodationModel.create({
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
  getLocation,
  getPageAccommodation,
  getAllAccommodation,
  createAccommodation,
  getAccommodationById,
};
