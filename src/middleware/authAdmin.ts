import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
const authRequest = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tokenAdmin } = req.body;
    if (tokenAdmin) {
      const accessToken = jwt.verify(tokenAdmin, SECRET_KEY);
      if (accessToken) {
        next();
      } else {
        res.status(400).json({ message: "Login expired!", code: 1 });
      }
    } else {
      res.status(400).json({ message: "User not login!", code: 1 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error!", code: 2 });
  }
};
export default authRequest;
