"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    userName: { type: String, required: true },
    password: String,
    token: String,
});
const UserModel = (0, mongoose_1.model)("user", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map