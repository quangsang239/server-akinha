"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accommodation_controller_1 = __importDefault(require("../controller/accommodation.controller"));
const router = express_1.default.Router();
router.get("/get-all-accommodation", accommodation_controller_1.default.getAllAccommodation);
exports.default = router;
//# sourceMappingURL=accommodation.router.js.map