"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const authLogin_1 = __importDefault(require("../middleware/authLogin"));
const authRequest_1 = __importDefault(require("../middleware/authRequest"));
const router = express_1.default.Router();
router.get("/get-all-user", authRequest_1.default, user_controller_1.default.getAllUser);
router.post("/create-user", user_controller_1.default.createUser);
router.post("/login", authLogin_1.default, user_controller_1.default.loginUser);
exports.default = router;
//# sourceMappingURL=user.router.js.map