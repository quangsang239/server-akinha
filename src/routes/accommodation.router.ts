import express from "express";
import accommodationController from "../controller/accommodation.controller";

const router = express.Router();
router.get(
  "/get-all-accommodation",
  accommodationController.getAllAccommodation
);
router.get("/get-room/:id", accommodationController.getAccommodationById);
router.post("/create-room", accommodationController.createAccommodation);

export default router;
