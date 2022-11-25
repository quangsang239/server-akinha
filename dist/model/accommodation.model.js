"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const accommodationSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    stateRoom: Boolean,
    imageRoom: [String],
    addressRoom: String,
    latitude: Number,
    longitude: Number,
    price: Number,
    nameRoom: String,
    area: Number,
    deposit: Number,
    aop: Number,
    utilities: [String],
    electricity: Number,
    water: Number,
    phoneNumber: String,
    name: String,
    category: String,
    sex: String,
    createAt: Date,
});
const accommodationModel = (0, mongoose_1.model)("accommodation", accommodationSchema);
exports.default = accommodationModel;
//# sourceMappingURL=accommodation.model.js.map