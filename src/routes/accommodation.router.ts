import express from "express";
import authRequest from "../middleware/authRequest";
import authAdmin from "../middleware/authAdmin";
import accommodationController from "../controller/accommodation.controller";

const router = express.Router();
router.get("/page=:page", accommodationController.getPageAccommodation);
router.get("/get-all", accommodationController.getAllAccommodation);
router.get(
  "/get-room/:userName/page=:page",
  authRequest,
  accommodationController.getAccommodationById
);
router.post(
  "/create-room",
  authRequest,
  accommodationController.createAccommodation
);
router.get("/location", accommodationController.getLocation);
router.get("/get-room/:_id", accommodationController.getRoom);
router.post("/update-room", authRequest, accommodationController.updateRoom);
router.delete(
  "/delete-room/:_id",
  authRequest,
  accommodationController.deleteRoom
);
router.post(
  "/delete-room-admin",
  authAdmin,
  accommodationController.deleteRoom
);
export default router;
