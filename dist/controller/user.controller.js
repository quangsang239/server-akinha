"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    const checkUser = await user_model_1.default.findOne({
        userName: userName.toLowerCase(),
    }).exec();
    if (checkUser)
        return res.status(400).json({ message: "user is exited!", code: 2 });
    const hashPassword = bcrypt_1.default.hashSync(password, config_1.SALT_ROUNDS);
    await user_model_1.default.create({
        email,
        userName: userName.toLowerCase(),
        password: hashPassword,
        refreshToken: "",
    })
        .then(() => {
        return res.status(200).json({
            message: "create user success!",
            code: 0,
        });
    })
        .catch((error) => {
        console.log(error);
        return res.status(400).json({
            message: "create user failed!",
            code: 1,
        });
    });
};
const loginUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        console.log(req.headers);
        const user = await user_model_1.default.findOne({
            userName,
        }).exec();
        if (user) {
            bcrypt_1.default.compare(password, user.password).then(async () => {
                const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.SECRET_KEY, {
                    expiresIn: "15m",
                });
                const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.REFRESH_KEY);
                await user_model_1.default.findOneAndUpdate({ _id: user._id }, { refreshToken })
                    .then(() => {
                    console.log("create refresh token success!");
                })
                    .catch((error) => {
                    console.log(error);
                });
                res.setHeader("Authorization", accessToken);
                res.status(200).json({
                    message: "Login Success!",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userName,
                });
            });
        }
        else
            res.status(400).json({ message: "User not found!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Server process failed!");
    }
};
const getNewAccessToken = async (req, res) => {
    try {
        const { token } = req.cookies;
        console.log(req.cookies);
        const { refreshToken, userName } = req.body;
        jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY, { ignoreExpiration: true }, async (err, decoded) => {
            if (err) {
                res.status(400).json({ message: "Access token incorrect!" });
            }
            else {
                console.log(decoded);
                const user = await user_model_1.default.findOne({
                    userName,
                }).exec();
                if (user) {
                    if (user.refreshToken === refreshToken) {
                        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.SECRET_KEY, {
                            expiresIn: "15m",
                        });
                        res
                            .status(200)
                            .json({ message: "new access token", accessToken });
                    }
                    else {
                        res.status(400).json({ message: "refresh token incorrect!" });
                    }
                }
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" });
    }
};
exports.default = {
    createUser,
    getAllUser,
    getUser,
    loginUser,
    getNewAccessToken,
};
//# sourceMappingURL=user.controller.js.map