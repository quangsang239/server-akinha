import express from "express";
import userController from "../controller/user.controller";
import authLogin from "../middleware/authLogin";
import authRequest from "../middleware/authRequest";

const router = express.Router();

router.get("/get-all-user", authRequest, userController.getAllUser);
router.post("/create-user", userController.createUser);
router.post("/login", authLogin, userController.loginUser);

export default router;
