"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
const userVerification_1 = __importDefault(require("../model/userVerification"));
const _ = __importStar(require("lodash"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
let transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: config_1.EMAIL_USERNAME,
        pass: config_1.EMAIL_PASSWORD,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log("Ready for message!!");
        console.log(success);
    }
});
const sendVerificationEmail = ({ _id, email }) => {
    const currentUrl = "http://localhost:1305/api/";
    const uniqueString = (0, uuid_1.v4)() + _id;
    const mailOptions = {
        from: config_1.EMAIL_USERNAME,
        to: email,
        subject: "Verify Your Email!!!",
        html: `<p>Verify your email address to complete signup and login</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`,
    };
    bcrypt_1.default
        .hash(uniqueString, config_1.SALT_ROUNDS)
        .then((hashedUniqueString) => {
        userVerification_1.default.create({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,
        })
            .then(() => {
            transporter
                .sendMail(mailOptions)
                .then(() => {
                console.log({
                    status: "PENDING",
                    message: "Verification email sent!",
                });
            })
                .catch((error) => {
                console.log(error);
                console.log({
                    status: "FAILED",
                    message: "Couldn't send email!",
                });
            });
        })
            .catch((error) => {
            console.log(error);
            console.log({
                status: "FAILED",
                message: "Couldn't save verification!",
            });
        });
    })
        .catch(() => {
        console.log({
            status: "FAILED!!",
            message: "An error occurred while hashing email data",
        });
    });
};
const getAllUser = async (_req, res, _next) => {
    const allUser = await user_model_1.default.find({}).exec();
    let newUser = [];
    for (const user of allUser) {
        console.log(_.pick(user, [
            "_id",
            "email",
            "userName",
            "name",
            "phoneNumber",
            "verified",
        ]));
        newUser.push(_.pick(user, [
            "_id",
            "email",
            "userName",
            "name",
            "phoneNumber",
            "verified",
        ]));
    }
    res.status(200).json(newUser);
};
const getUser = async (req, res, _next) => {
    const { userName } = req.params;
    const user = await user_model_1.default.findOne({ userName }).exec();
    if (user) {
        res.status(200).json({
            code: 0,
            user: {
                email: user.email,
                name: user.name,
                phoneNumber: user.phoneNumber,
                verified: user.verified,
                userName: user.userName,
            },
        });
    }
    else {
        res.status(400).json({ code: 1, message: "Không tìm thấy người dùng!" });
    }
};
const createUser = async (req, res, _next) => {
    const { email, userName, password, phoneNumber, name } = req.body;
    const checkUser = await user_model_1.default.findOne({
        userName: userName,
    }).exec();
    if (checkUser)
        return res
            .status(400)
            .json({ message: "Tài khoản đã được đăng ký!", code: 2 });
    const hashPassword = bcrypt_1.default.hashSync(password, config_1.SALT_ROUNDS);
    await user_model_1.default.create({
        email,
        name,
        phoneNumber,
        userName: userName,
        password: hashPassword,
        refreshToken: "",
        verified: false,
    })
        .then((result) => {
        sendVerificationEmail(result);
        return res.status(200).json({
            message: "Tạo tài khoản thành công tiến hành đăng nhập!",
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
        const user = await user_model_1.default.findOne({
            userName,
        }).exec();
        if (user) {
            bcrypt_1.default
                .compare(password, user.password)
                .then(async (result) => {
                if (result) {
                    const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.SECRET_KEY, {
                        expiresIn: "24h",
                    });
                    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.REFRESH_KEY);
                    await user_model_1.default.findOneAndUpdate({ _id: user._id }, { refreshToken })
                        .then(() => {
                        res.status(200).json({
                            code: 0,
                            message: "Đăng nhập thành công!",
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            userName,
                            name: user.name,
                            phoneNumber: user.phoneNumber,
                            verified: user.verified,
                            expireAt: Date.now() + 24 * 60 * 60 * 1000,
                        });
                    })
                        .catch((error) => {
                        console.log(error);
                    });
                }
                else
                    res
                        .status(400)
                        .json({ code: 1, message: "Sai tài khoản hoặc mật khẩu!" });
            })
                .catch((error) => {
                console.log(error);
                res.status(500).json("Server process failed!");
            });
        }
        else
            res
                .status(400)
                .json({ code: 1, message: "Sai tài khoản hoặc mật khẩu!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Server process failed!");
    }
};
const getNewAccessToken = async (req, res) => {
    try {
        const { token } = req.cookies;
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
const userVerify = (req, res) => {
    const userId = req.params.userId;
    const uniqueString = req.params.uniqueString;
    userVerification_1.default.find({ userId })
        .sort({ createAt: "ascending" })
        .then((result) => {
        if (result.length > 0) {
            const { expiresAt } = result[result.length - 1];
            const hashedUniqueString = result[result.length - 1].uniqueString;
            if (expiresAt.getTime() < Date.now()) {
                userVerification_1.default.deleteMany({ userId })
                    .then(() => {
                    user_model_1.default.deleteOne({ _id: userId })
                        .then(() => {
                        let message = "Link has expired. Please signup again";
                        res.redirect(`/api/user/verified/error=true&message=${message}`);
                    })
                        .catch((error) => {
                        console.log(error);
                        let message = "Clearing user with expired unique string failed";
                        res.redirect(`/api/user/verified/error=true&message=${message}`);
                    });
                })
                    .catch((error) => {
                    console.log(error);
                    let message = "An error occurred while clearing for expired user verification record";
                    res.redirect(`/api/user/verified/error=true&message=${message}`);
                });
            }
            else {
                bcrypt_1.default
                    .compare(uniqueString, hashedUniqueString)
                    .then((result) => {
                    if (result) {
                        user_model_1.default.updateOne({ _id: userId }, { verified: true })
                            .then(() => {
                            userVerification_1.default.deleteMany({ userId })
                                .then(() => {
                                res.sendFile(path_1.default.join(__dirname, "./../views/verified.html"));
                            })
                                .catch((error) => {
                                console.log(error);
                                let message = "An error while finalizing successful verification";
                                res.redirect(`/api/user/verified/error=true&message=${message}`);
                            });
                        })
                            .catch((error) => {
                            console.log(error);
                            let message = "An error while updating user";
                            res.redirect(`/api/user/verified/error=true&message=${message}`);
                        });
                    }
                    else {
                        let message = "invalid verification details passed. Check your inbox.";
                        res.redirect(`/api/user/verified/error=true&message=${message}`);
                    }
                })
                    .catch((error) => {
                    console.log(error);
                    let message = "An error occurred while comparing unique strings";
                    res.redirect(`/api/user/verified/error=true&message=${message}`);
                });
            }
        }
        else {
            let message = "Account record doesn't exit or has been verify already. Please signup and login.";
            res.redirect(`/api/user/verified/error=true&message=${message}`);
        }
    })
        .catch((error) => {
        console.log(error);
        let message = "An error occurred while checking for exiting user verification record";
        res.redirect(`/api/user/verified/error=true&message=${message}`);
    });
};
const sendVerify = (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./../views/verified.html"));
};
const updateUser = async (req, res) => {
    const { userName, email, changeEmail, name, phoneNumber } = req.body;
    if (changeEmail) {
        user_model_1.default.findOneAndUpdate({ userName }, {
            email,
            name,
            phoneNumber,
            verified: false,
        })
            .then((result) => {
            if (result) {
                sendVerificationEmail({ _id: result._id, email: email });
                res
                    .status(200)
                    .json({ code: 0, message: "Cập nhật tài khoản thành công!" });
            }
            else {
                res
                    .status(200)
                    .json({ code: 2, message: "Không tìm thấy tài khoản!" });
            }
        })
            .catch((error) => {
            console.log(error);
            res.status(500).json({ code: 1, message: "Lỗi server!" });
        });
    }
    else {
        user_model_1.default.findOneAndUpdate({ userName }, {
            email,
            name,
            phoneNumber,
        })
            .then(() => {
            res
                .status(200)
                .json({ code: 0, message: "Cập nhật tài khoản thành công!" });
        })
            .catch((error) => {
            console.log(error);
            res.status(500).json({ code: 1, message: "Lỗi server!" });
        });
    }
};
const newPassword = async (req, res) => {
    const { userName, currentPassword, newPassword } = req.body;
    await user_model_1.default.findOne({ userName }).then((result) => {
        if (result) {
            bcrypt_1.default.compare(currentPassword, result.password).then(async (value) => {
                if (value) {
                    const hashNewPassword = bcrypt_1.default.hashSync(newPassword, config_1.SALT_ROUNDS);
                    await user_model_1.default.findOneAndUpdate({ userName }, {
                        password: hashNewPassword,
                    })
                        .then(() => {
                        res
                            .status(200)
                            .json({ code: 0, message: "Đổi mật khẩu thành công!" });
                    })
                        .catch(() => {
                        res.status(500).json({ code: 1, message: "Server Lỗi!" });
                    });
                }
                else {
                    res
                        .status(200)
                        .json({ code: 2, message: "Mật khẩu hiện tại không đúng" });
                }
            });
        }
        else {
            res.status(500).json({ code: 1, message: "Không tìm thấy tài khoản!" });
        }
    });
};
const deleteUser = (req, res) => {
    const { _id } = req.body;
    user_model_1.default.findByIdAndDelete({ _id })
        .then(() => {
        res.status(200).json({ code: 0, message: "Xoá người dùng thành công!" });
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json({ code: 1, message: "Xoá người dùng thất bại" });
    });
};
const sendNewVerify = (req, res) => {
    const { userName, email } = req.body;
    user_model_1.default.findOne({ userName })
        .then((result) => {
        if (result) {
            sendVerificationEmail({ _id: result._id, email });
            res.status(200).json("Gửi email thành công!");
        }
        else {
            res.status(400).json("Gửi email không thành công!");
        }
    })
        .catch((error) => {
        console.log(error);
        res.status(500).json("Lỗi server!");
    });
};
exports.default = {
    createUser,
    getAllUser,
    getUser,
    loginUser,
    getNewAccessToken,
    userVerify,
    sendVerify,
    updateUser,
    newPassword,
    deleteUser,
    sendNewVerify,
};
//# sourceMappingURL=user.controller.js.map