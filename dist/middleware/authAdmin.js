"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const authRequest = (req, res, next) => {
    try {
        const { tokenAdmin } = req.body;
        if (tokenAdmin) {
            const accessToken = jsonwebtoken_1.default.verify(tokenAdmin, config_1.SECRET_KEY);
            if (accessToken) {
                next();
            }
            else {
                res.status(400).json({ message: "Login expired!", code: 1 });
            }
        }
        else {
            res.status(400).json({ message: "User not login!", code: 1 });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error!", code: 2 });
    }
};
exports.default = authRequest;
//# sourceMappingURL=authAdmin.js.map