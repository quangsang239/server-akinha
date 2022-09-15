"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAllUser = async (_req, res, _next) => {
    const allUser = await user_model_1.default.find({}).exec();
    res.status(200).json(allUser);
};
const getUser = async (req, res, _next) => {
    const { email } = req.body;
    const user = await user_model_1.default.findOne(email).exec();
    res.status(200).json(user);
};
const createUser = async (req, res, _next) => {
    const { email, userName, password } = req.body;
    console.log({ email, userName, password });
    const checkUser = await user_model_1.default.findOne({ userName }).exec();
    if (!checkUser) {
        await user_model_1.default.create({
            email,
            userName,
            password,
            token: "",
        })
            .then(() => {
            res.status(200).json({
                message: "create user success!",
                code: 0,
            });
        })
            .catch((error) => {
            console.log(error);
            res.status(400).json({
                message: "create user failed!",
                code: 1,
            });
        });
    }
    else {
        res.status(400).json({ message: "user is exited!", code: 2 });
    }
};
const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await user_model_1.default.findOne({
            userName,
            password,
        }).exec();
        if (user) {
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.SECRET_KEY, {
                expiresIn: "15m",
            });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.SECRET_KEY);
            await user_model_1.default.findOneAndUpdate({ _id: user._id }, { refreshToken })
                .then(() => {
                console.log("create refresh token success!");
            })
                .catch((error) => {
                console.log(error);
            });
            res.status(200).json({ message: "Login Success!", token: accessToken });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Server process failed!");
    }
};
exports.default = {
    createUser,
    getAllUser,
    getUser,
    loginUser,
};
//# sourceMappingURL=user.controller.js.map