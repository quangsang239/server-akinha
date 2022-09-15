import { IUser } from "../types/index";
import UserModel from "../model/user.model";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../config/config";

import jwt from "jsonwebtoken";

const getAllUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const allUser: IUser[] = await UserModel.find({}).exec();
  res.status(200).json(allUser);
};
const getUser = async (req: Request, res: Response, _next: NextFunction) => {
  const { email } = req.body;
  const user: IUser | null = await UserModel.findOne(email).exec();
  res.status(200).json(user);
};
const createUser = async (req: Request, res: Response, _next: NextFunction) => {
  const { email, userName, password } = req.body;
  console.log({ email, userName, password });
  const checkUser: IUser | null = await UserModel.findOne({ userName }).exec();
  if (!checkUser) {
    await UserModel.create({
      email,
      userName,
      password,
      token: "",
    })
      .then(() => {
        res.status(200).json({
          message: "create user success!",
          code: 0,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({
          message: "create user failed!",
          code: 1,
        });
      });
  } else {
    res.status(400).json({ message: "user is exited!", code: 2 });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    const user: IUser | null = await UserModel.findOne({
      userName,
      password,
    }).exec();
    if (user) {
      const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "15m",
      });
      const refreshToken = jwt.sign({ userId: user._id }, SECRET_KEY);
      await UserModel.findOneAndUpdate({ _id: user._id }, { refreshToken })
        .then(() => {
          console.log("create refresh token success!");
        })
        .catch((error) => {
          console.log(error);
        });
      res.status(200).json({ message: "Login Success!", token: accessToken });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Server process failed!");
  }
};
export default {
  createUser,
  getAllUser,
  getUser,
  loginUser,
};
