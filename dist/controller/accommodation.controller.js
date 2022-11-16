"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const accommodation_model_1 = __importDefault(require("../model/accommodation.model"));
const data_json_1 = __importDefault(require("../data/data.json"));
let getLocation = (_req, res) => {
    res.status(200).json(data_json_1.default);
};
let getAllAccommodation = (_req, res) => {
    accommodation_model_1.default.find({})
        .then((data) => {
        res.status(200).json({ data });
    })
        .catch((error) => {
        console.log(error);
        res.status(400).json({ code: 1, message: "server error!" });
    });
};
let getPageAccommodation = async (req, res, _next) => {
    const page = parseInt(req.params.page);
    console.log(page);
    const PAGE_SIZE = 4;
    if (page) {
        const totalDocument = await accommodation_model_1.default.countDocuments().exec();
        accommodation_model_1.default.find({})
            .skip((page - 1) * PAGE_SIZE)
            .limit(4)
            .then((data) => {
            res.status(200).json({ totalDocument, data });
        })
            .catch((error) => {
            console.log(error);
            res.status(400).json({ code: 1, message: "server error!" });
        });
    }
    else {
        res.status(400).json({ code: 1, message: "server error!" });
    }
};
let createAccommodation = (req, res, _next) => {
    const { userId, stateRoom, imageRoom, addressRoom, latitude, longitude, price, phone, } = req.body;
    accommodation_model_1.default.create({
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
    getLocation,
    getPageAccommodation,
    getAllAccommodation,
    createAccommodation,
    getAccommodationById,
};
//# sourceMappingURL=accommodation.controller.js.map