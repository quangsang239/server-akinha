"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accommodationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    stateRoom: String,
    imageRoom: [String],
    addressRoom: String,
    latitude: Number,
    longitude: Number,
    price: Number,
    phone: Number,
});
const accommodationModel = (0, mongoose_1.model)("accommodation", accommodationSchema);
exports.default = accommodationModel;
//# sourceMappingURL=accommodation.model.js.map