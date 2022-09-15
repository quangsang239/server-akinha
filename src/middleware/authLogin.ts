import { Request, Response, NextFunction } from "express";

import UserModel from "../model/user.model";
import { IUser } from "../types/index";

const authLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { userName, password } = req.body;
  const user: IUser | null = await UserModel.findOne({
    userName,
    password,
  }).exec();
  if (!user) {
    res.status(500).json({ message: "not found user!" });
  } else next();
};
export default authLogin;
