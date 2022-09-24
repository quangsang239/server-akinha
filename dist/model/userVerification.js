"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userVerificationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    uniqueString: { type: String, required: true },
    createdAt: Date,
    expiresAt: Date,
});
const UserVerifiCationModel = (0, mongoose_1.model)("userVerification", userVerificationSchema);
exports.default = UserVerifiCationModel;
//# sourceMappingURL=userVerification.js.map