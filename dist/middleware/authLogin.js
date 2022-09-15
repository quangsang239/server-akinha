"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
const authLogin = async (req, res, next) => {
    const { userName, password } = req.body;
    const user = await user_model_1.default.findOne({
        userName,
        password,
    }).exec();
    if (!user) {
        res.status(500).json({ message: "not found user!" });
    }
    else
        next();
};
exports.default = authLogin;
//# sourceMappingURL=authLogin.js.map