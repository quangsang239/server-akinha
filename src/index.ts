import express from "express";
import http from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import { urlConnection, port } from "./config/config";
import router from "./routes/index";
const server = async () => {
  try {
    await mongoose.connect(urlConnection, {}).then(() => {
      console.log("connect server success");
    });
    const app = express();
    // app.use("/user", router);
    app.use(cookieParser());
    app.use(express.json());
    router(app);
    const httpServer = http.createServer(app);

    httpServer.listen(port, () => {
      console.log(`connection success on port: http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
server();
