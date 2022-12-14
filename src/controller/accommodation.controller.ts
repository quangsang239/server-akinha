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
      res.status(200).json(data);
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
      res.status(200).json({ code: 0, message: "Th??m ph??ng m???i th??nh c??ng!" });
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
const getRoom = (req: Request, res: Response) => {
  const { _id } = req.params;
  if (_id) {
    AccommodationModel.findById({ _id })
      .then((result) => {
        res.status(200).json({ result });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json("server error!");
      });
  }
};
const updateRoom = (req: Request, res: Response) => {
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
    _id,
  }: IAccommodation = req.body;

  AccommodationModel.findByIdAndUpdate(
    { _id },
    {
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
    }
  )
    .then(() => {
      res.status(200).json({ code: 0, message: "C???p nh???t ph??ng th??nh c??ng!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ code: 1, message: "L???i server!" });
    });
};
const deleteRoom = (req: Request, res: Response) => {
  const { _id } = req.params;
  AccommodationModel.findByIdAndDelete({ _id })
    .then(() => {
      res.status(200).json({ code: 0, message: "Xo?? ph??ng th??nh c??ng!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ code: 1, message: "Xo?? ph??ng th???t b???i" });
    });
};
const deleteRoomAdmin = (req: Request, res: Response) => {
  const { _id } = req.body;
  AccommodationModel.findByIdAndDelete({ _id })
    .then(() => {
      res.status(200).json({ code: 0, message: "Xo?? ph??ng th??nh c??ng!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ code: 1, message: "Xo?? ph??ng th???t b???i" });
    });
};
export default {
  getLocation,
  getPageAccommodation,
  getAllAccommodation,
  createAccommodation,
  getAccommodationById,
  getRoom,
  updateRoom,
  deleteRoom,
  deleteRoomAdmin,
};
