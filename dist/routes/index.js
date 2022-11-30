"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const user_router_1 = __importDefault(require("./user.router"));
const accommodation_router_1 = __importDefault(require("./accommodation.router"));
const router = (app) => {
    app.use((0, cors_1.default)({
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json());
    app.get("/", (_req, res) => {
        res.send("server");
    });
    app.post("/api/login", user_controller_1.default.loginUser);
    app.use("/api/user", user_router_1.default);
    app.use("/api/room", accommodation_router_1.default);
};
exports.default = router;
//# sourceMappingURL=index.js.map