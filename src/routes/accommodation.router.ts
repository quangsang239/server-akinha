import express from "express";
import accommodationController from "../controller/accommodation.controller";

const router = express.Router();
router.get(
  "/get-all-accommodation",
  accommodationController.getAllAccommodation
);

export default router;
