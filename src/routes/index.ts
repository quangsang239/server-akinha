import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import userController from "../controller/user.controller";

import userRouter from "./user.router";
import roomRouter from "./accommodation.router";

const router = (app: Application) => {
  app.use(function (_req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Header", "Content-Type");
    next();
  });
  app.use(cookieParser());
  app.use(express.json());
  app.get("/", (_req: Request, res: Response) => {
    res.send("server");
  });
  app.post("/api/login", userController.loginUser);
  app.use("/api/user", userRouter);
  app.use("/api/room", roomRouter);
};
export default router;
