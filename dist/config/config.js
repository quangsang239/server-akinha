"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_PASSWORD = exports.EMAIL_USERNAME = exports.KEY_SESSION = exports.SALT_ROUNDS = exports.REFRESH_KEY = exports.SECRET_KEY = exports.port = exports.urlConnection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.urlConnection = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@akinha.rmwryg9.mongodb.net/akinha`;
exports.port = process.env.SERVER_PORT || 9090;
exports.SECRET_KEY = process.env.SECRET_KEY || "mbx14SAYVWe0RgweHMHZIIaSGOFTmETv";
exports.REFRESH_KEY = process.env.REFRESH_KEY || "isLtqfdWsjFG9T2vAz6Ju6eHFAbjW8SW";
exports.SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 3;
exports.KEY_SESSION = process.env.KEY_SESSION || "FXhuh9QEcVo5ETWCIScUF4uAUvEcPZ3M";
exports.EMAIL_USERNAME = process.env.EMAIL_USERNAME;
exports.EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
//# sourceMappingURL=config.js.map