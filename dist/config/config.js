"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = exports.port = exports.urlConnection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.urlConnection = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@akinha.rmwryg9.mongodb.net/test`;
exports.port = process.env.SERVER_PORT || 9090;
exports.SECRET_KEY = process.env.SECRET_KEY || "mbx14SAYVWe0RgweHMHZIIaSGOFTmETv";
//# sourceMappingURL=config.js.map