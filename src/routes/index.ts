import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userController from "../controller/user.controller";

import userRouter from "./user.router";
import roomRouter from "./accommodation.router";

const router = (app: Application) => {
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    })
  );
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
