"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accommodation_controller_1 = __importDefault(require("../controller/accommodation.controller"));
const router = express_1.default.Router();
router.get("/page=:page", accommodation_controller_1.default.getPageAccommodation);
router.get("/get-all", accommodation_controller_1.default.getAllAccommodation);
router.get("/get-room/:userName/page=:page", accommodation_controller_1.default.getAccommodationById);
router.post("/create-room", accommodation_controller_1.default.createAccommodation);
router.get("/location", accommodation_controller_1.default.getLocation);
exports.default = router;
//# sourceMappingURL=accommodation.router.js.map