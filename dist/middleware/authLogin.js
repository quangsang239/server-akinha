"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const authLogin = async (req, res, next) => {
    bcrypt_1.default.compare(password, user.password).then(() => {
        req.body.user = user;
        next();
    });
};
;
exports.default = authLogin;
//# sourceMappingURL=authLogin.js.map