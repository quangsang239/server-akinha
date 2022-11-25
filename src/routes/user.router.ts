import express from "express";
import userController from "../controller/user.controller";
import authRequest from "../middleware/authRequest";

const router = express.Router();

router.get("/get-all-user", authRequest, userController.getAllUser);
router.post("/create-user", userController.createUser);
router.post("/get-access-token", userController.getNewAccessToken);
router.get("/verify/:userId/:uniqueString", userController.userVerify);
router.post("/verified", userController.sendVerify);
router.get("/get-profile/:userName", authRequest, userController.getUser);
router.post("/update-profile", authRequest, userController.updateUser);
export default router;
