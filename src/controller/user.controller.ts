import { IUser } from "../types/index";
import UserModel from "../model/user.model";
import { Request, Response, NextFunction } from "express";
import { SECRET_KEY, REFRESH_KEY, SALT_ROUNDS } from "../config/config";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  const { email, userName, password } = req.body;
  console.log({ email, userName, password });
  const checkUser: IUser | null = await UserModel.findOne({
    userName: userName.toLowerCase(),
  }).exec();
  if (checkUser)
    return res.status(400).json({ message: "user is exited!", code: 2 });
  const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  await UserModel.create({
    email,
    userName: userName.toLowerCase(),
    password: hashPassword,
    refreshToken: "",
  })
    .then(() => {
      return res.status(200).json({
        message: "create user success!",
        code: 0,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        message: "create user failed!",
        code: 1,
      });
    });
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    const user: IUser | null = await UserModel.findOne({
      userName,
    }).exec();
    if (user) {
      bcrypt.compare(password, user.password).then(async () => {
        const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
          expiresIn: "15m",
        });
        const refreshToken = jwt.sign({ userId: user._id }, REFRESH_KEY);
        await UserModel.findOneAndUpdate({ _id: user._id }, { refreshToken })
          .then(() => {
            console.log("create refresh token success!");
          })
          .catch((error) => {
            console.log(error);
          });
        res.status(200).json({
          message: "Login Success!",
          accessToken: accessToken,
          refreshToken: refreshToken,
          userName,
        });
      });
    } else res.status(400).json({ message: "User not found!" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server process failed!");
  }
};
const getNewAccessToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    console.log(req.cookies);
    const { refreshToken, userName } = req.body;
    jwt.verify(
      token,
      SECRET_KEY,
      { ignoreExpiration: true },
      async (err, decoded) => {
        if (err) {
          res.status(400).json({ message: "Access token incorrect!" });
        } else {
          console.log(decoded);
          const user: IUser | null = await UserModel.findOne({
            userName,
          }).exec();
          if (user) {
            if (user.refreshToken === refreshToken) {
              const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
                expiresIn: "15m",
              });
              res
                .status(200)
                .json({ message: "new access token", accessToken });
            } else {
              res.status(400).json({ message: "refresh token incorrect!" });
            }
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
};
export default {
  createUser,
  getAllUser,
  getUser,
  loginUser,
  getNewAccessToken,
};
