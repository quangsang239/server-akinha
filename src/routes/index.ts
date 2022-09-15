import { Application, Request, Response, NextFunction } from "express";
import userRouter from "./user.router";

const router = (app: Application) => {
  app.use(function (_req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Header", "Content-Type");
    next();
  });
  app.get("/", (_req: Request, res: Response) => {
    res.send("server");
  });
  app.use("/user", userRouter);
};
export default router;
