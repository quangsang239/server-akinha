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
        res.status(200).json(data);
    })
        .catch((error) => {
        console.log(error);
        res.status(400).json({ code: 1, message: "server error!" });
    });
};
let getPageAccommodation = async (req, res, _next) => {
    const page = parseInt(req.params.page);
    const PAGE_SIZE = 4;
    const { district, category, sex, price } = req.query;
    if (page) {
        const totalDocument = await accommodation_model_1.default.countDocuments({
            addressRoom: { $regex: district },
            category: { $regex: category },
            sex: { $regex: sex },
            price: { $lte: Number(price) },
        }).exec();
        accommodation_model_1.default.find({
            addressRoom: { $regex: district },
            category: { $regex: category },
            sex: { $regex: sex },
            price: { $lte: Number(price) },
        })
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
    const { userName, stateRoom, imageRoom, addressRoom, latitude, longitude, price, nameRoom, area, deposit, aop, utilities, electricity, water, phoneNumber, name, sex, category, } = req.body;
    accommodation_model_1.default.create({
        userName,
        stateRoom,
        imageRoom,
        addressRoom,
        latitude,
        longitude,
        price,
        nameRoom,
        area,
        deposit,
        aop,
        utilities,
        electricity,
        water,
        phoneNumber,
        name,
        sex,
        category,
        createAt: Date.now(),
    })
        .then(() => {
        res.status(200).json({ code: 0, message: "Th??m ph??ng m???i th??nh c??ng!" });
    })
        .catch((error) => {
        res
            .status(400)
            .json({ code: 1, message: "Create Accommodation failed!" });
        console.log(error);
    });
};
let getAccommodationById = async (req, res, _next) => {
    const { userName, page } = req.params;
    const totalDocument = await accommodation_model_1.default.countDocuments({
        userName,
    }).exec();
    accommodation_model_1.default.find({ userName })
        .skip((Number(page) - 1) * 3)
        .limit(3)
        .then((data) => {
        res.status(200).json({ totalDocument, data });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json("Server error!");
    });
};
const getRoom = (req, res) => {
    const { _id } = req.params;
    if (_id) {
        accommodation_model_1.default.findById({ _id })
            .then((result) => {
            res.status(200).json({ result });
        })
            .catch((error) => {
            console.log(error);
            res.status(500).json("server error!");
        });
    }
};
const updateRoom = (req, res) => {
    const { userName, stateRoom, imageRoom, addressRoom, latitude, longitude, price, nameRoom, area, deposit, aop, utilities, electricity, water, phoneNumber, name, sex, category, _id, } = req.body;
    accommodation_model_1.default.findByIdAndUpdate({ _id }, {
        userName,
        stateRoom,
        imageRoom,
        addressRoom,
        latitude,
        longitude,
        price,
        nameRoom,
        area,
        deposit,
        aop,
        utilities,
        electricity,
        water,
        phoneNumber,
        name,
        sex,
        category,
    })
        .then(() => {
        res.status(200).json({ code: 0, message: "C???p nh???t ph??ng th??nh c??ng!" });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json({ code: 1, message: "L???i server!" });
    });
};
const deleteRoom = (req, res) => {
    const { _id } = req.params;
    accommodation_model_1.default.findByIdAndDelete({ _id })
        .then(() => {
        res.status(200).json({ code: 0, message: "Xo?? ph??ng th??nh c??ng!" });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json({ code: 1, message: "Xo?? ph??ng th???t b???i" });
    });
};
const deleteRoomAdmin = (req, res) => {
    const { _id } = req.body;
    accommodation_model_1.default.findByIdAndDelete({ _id })
        .then(() => {
        res.status(200).json({ code: 0, message: "Xo?? ph??ng th??nh c??ng!" });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json({ code: 1, message: "Xo?? ph??ng th???t b???i" });
    });
};
exports.default = {
    getLocation,
    getPageAccommodation,
    getAllAccommodation,
    createAccommodation,
    getAccommodationById,
    getRoom,
    updateRoom,
    deleteRoom,
    deleteRoomAdmin,
};
//# sourceMappingURL=accommodation.controller.js.map