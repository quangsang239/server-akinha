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
  const PAGE_SIZE = 4;
  const { district, category, sex, price } = req.query;
  console.log({ district, category, sex, price });
  if (page) {
    const totalDocument = await AccommodationModel.countDocuments({
      addressRoom: { $regex: district },
      category: { $regex: category },
      sex: { $regex: sex },
      price: { $lte: Number(price) },
    }).exec();
    AccommodationModel.find({
      addressRoom: { $regex: district },
      category: { $regex: category },
      sex: { $regex: sex },
      price: { $lte: Number(price) },
    })
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
    userName,
    stateRoom,
    imageRoom,
    addressRoom,
    latitude,
    longitude,
    price,
    nameRoom,
    area,
    deposit,
    aop,
    utilities,
    electricity,
    water,
    phoneNumber,
    name,
    sex,
    category,
  }: IAccommodation = req.body;
  AccommodationModel.create({
    userName,
    stateRoom,
    imageRoom,
    addressRoom,
    latitude,
    longitude,
    price,
    nameRoom,
    area,
    deposit,
    aop,
    utilities,
    electricity,
    water,
    phoneNumber,
    name,
    sex,
    category,
    createAt: Date.now(),
  })
    .then(() => {
      res.status(200).json({ code: 0, message: "Thêm phòng mới thành công!" });
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
  const { userName, page } = req.params;
  const totalDocument = await AccommodationModel.countDocuments({
    userName,
  }).exec();
  AccommodationModel.find({ userName })
    .skip((Number(page) - 1) * 3)
    .limit(3)
    .then((data) => {
      res.status(200).json({ totalDocument, data });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json("Server error!");
    });
};
export default {
  getLocation,
  getPageAccommodation,
  getAllAccommodation,
  createAccommodation,
  getAccommodationById,
};
