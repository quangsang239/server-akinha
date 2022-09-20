"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const index_1 = __importDefault(require("./routes/index"));
const server = async () => {
    try {
        await mongoose_1.default.connect(config_1.urlConnection, {}).then(() => {
            console.log("connect server success");
        });
        const app = (0, express_1.default)();
        (0, index_1.default)(app);
        const httpServer = http_1.default.createServer(app);
        httpServer.listen(config_1.port, () => {
            console.log(`connection success on port: http://localhost:${config_1.port}`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
server();
//# sourceMappingURL=index.js.map