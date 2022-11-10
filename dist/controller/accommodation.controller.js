"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accommodation_model_1 = __importDefault(require("../model/accommodation.model"));
let getAllAccommodation = async (_req, res, _next) => {
    const AllAccommodation = await accommodation_model_1.default.find({}).exec();
    res.status(200).json(AllAccommodation);
};
let createAccommodation = async (req, res, _next) => {
    const { userId, stateRoom, imageRoom, addressRoom, latitude, longitude, price, phone, } = req.body;
    await accommodation_model_1.default.create({
        userId,
        stateRoom,
        imageRoom,
        addressRoom,
        latitude,
        longitude,
        price,
        phone,
    })
        .then(() => {
        res
            .status(200)
            .json({ code: 0, message: "Create Accommodation successfully!" });
    })
        .catch((error) => {
        res
            .status(400)
            .json({ code: 1, message: "Create Accommodation failed!" });
        console.log(error);
    });
};
let getAccommodationById = async (req, res, _next) => {
    const { userId } = req.params;
    const listAccommodation = await accommodation_model_1.default.find({
        userId,
    }).exec();
    res.status(200).json(listAccommodation);
};
exports.default = {
    getAllAccommodation,
    createAccommodation,
    getAccommodationById,
};
//# sourceMappingURL=accommodation.controller.js.map