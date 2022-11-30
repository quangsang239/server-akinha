"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const authRequest_1 = __importDefault(require("../middleware/authRequest"));
const authAdmin_1 = __importDefault(require("../middleware/authAdmin"));
const router = express_1.default.Router();
router.get("/get-all-user", user_controller_1.default.getAllUser);
router.post("/create-user", user_controller_1.default.createUser);
router.post("/get-access-token", user_controller_1.default.getNewAccessToken);
router.get("/verify/:userId/:uniqueString", user_controller_1.default.userVerify);
router.post("/verified", user_controller_1.default.sendVerify);
router.get("/get-profile/:userName", authRequest_1.default, user_controller_1.default.getUser);
router.post("/update-profile", authRequest_1.default, user_controller_1.default.updateUser);
router.post("/new-password", authRequest_1.default, user_controller_1.default.newPassword);
router.post("/delete-user", authAdmin_1.default, user_controller_1.default.deleteUser);
router.post("/send-new-email", authRequest_1.default, user_controller_1.default.sendNewVerify);
exports.default = router;
//# sourceMappingURL=user.router.js.map