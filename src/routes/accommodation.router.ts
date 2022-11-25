import express from "express";
import accommodationController from "../controller/accommodation.controller";

const router = express.Router();
router.get("/page=:page", accommodationController.getPageAccommodation);
router.get("/get-all", accommodationController.getAllAccommodation);
router.get(
  "/get-room/:userName/page=:page",
  accommodationController.getAccommodationById
);
router.post("/create-room", accommodationController.createAccommodation);
router.get("/location", accommodationController.getLocation);

export default router;
