"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_router_1 = __importDefault(require("./user.router"));
const router = (app) => {
    app.use(function (_req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
        res.header("Access-Control-Allow-Header", "Content-Type");
        next();
    });
    app.get("/", (_req, res) => {
        res.send("server");
    });
    app.use("/user", user_router_1.default);
};
exports.default = router;
//# sourceMappingURL=index.js.map