import express from "express";
import http from "http";
import mongoose from "mongoose";

import { urlConnection, port } from "./config/config";
import router from "./routes/index";
const server = async () => {
  try {
    await mongoose.connect(urlConnection, {}).then(() => {
      console.log("connect server success");
    });
    const app = express();
    // app.use("/user", router);
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
