"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../model/user.model"));
const userVerification_1 = __importDefault(require("../model/userVerification"));
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
    const currentUrl = "http://localhost:1305/";
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
        verified: false,
    })
        .then((result) => {
        sendVerificationEmail(result);
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
        const user = await user_model_1.default.findOne({
            userName,
        }).exec();
        if (user) {
            bcrypt_1.default.compare(password, user.password).then(async () => {
                const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.SECRET_KEY, {
                    expiresIn: "24h",
                });
                const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.REFRESH_KEY);
                await user_model_1.default.findOneAndUpdate({ _id: user._id }, { refreshToken })
                    .then(() => {
                    console.log("create refresh token success!");
                })
                    .catch((error) => {
                    console.log(error);
                });
                res.status(200).json({
                    code: 0,
                    message: "Đăng nhập thành công!",
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userName,
                    verified: user.verified,
                    expireAt: Date.now() + 24 * 60 * 60 * 1000,
                });
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
const userVerify = (req, res) => {
    const userId = req.params.userId;
    const uniqueString = req.params.uniqueString;
    userVerification_1.default.find({ userId })
        .then((result) => {
        console.log({ result });
        if (result.length > 0) {
            const { expiresAt } = result[0];
            const hashedUniqueString = result[0].uniqueString;
            if (expiresAt.getTime() < Date.now()) {
                userVerification_1.default.deleteOne({ userId })
                    .then(() => {
                    user_model_1.default.deleteOne({ _id: userId })
                        .then(() => {
                        let message = "Link has expired. Please signup again";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    })
                        .catch((error) => {
                        console.log(error);
                        let message = "Clearing user with expired unique string failed";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    });
                })
                    .catch((error) => {
                    console.log(error);
                    let message = "An error occurred while clearing for expired user verification record";
                    res.redirect(`/user/verified/error=true&message=${message}`);
                });
            }
            else {
                bcrypt_1.default
                    .compare(uniqueString, hashedUniqueString)
                    .then((result) => {
                    if (result) {
                        user_model_1.default.updateOne({ _id: userId }, { verified: true })
                            .then(() => {
                            userVerification_1.default.deleteOne({ userId })
                                .then(() => {
                                res.sendFile(path_1.default.join(__dirname, "./../views/verified.html"));
                            })
                                .catch((error) => {
                                console.log(error);
                                let message = "An error while finalizing successful verification";
                                res.redirect(`/user/verified/error=true&message=${message}`);
                            });
                        })
                            .catch((error) => {
                            console.log(error);
                            let message = "An error while updating user";
                            res.redirect(`/user/verified/error=true&message=${message}`);
                        });
                    }
                    else {
                        let message = "invalid verification details passed. Check your inbox.";
                        res.redirect(`/user/verified/error=true&message=${message}`);
                    }
                })
                    .catch((error) => {
                    console.log(error);
                    let message = "An error occurred while comparing unique strings";
                    res.redirect(`/user/verified/error=true&message=${message}`);
                });
            }
        }
        else {
            let message = "Account record doesn't exit or has been verify already. Please signup and login.";
            res.redirect(`/user/verified/error=true&message=${message}`);
        }
    })
        .catch((error) => {
        console.log(error);
        let message = "An error occurred while checking for exiting user verification record";
        res.redirect(`/user/verified/error=true&message=${message}`);
    });
};
const sendVerify = (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./../views/verified.html"));
};
exports.default = {
    createUser,
    getAllUser,
    getUser,
    loginUser,
    getNewAccessToken,
    userVerify,
    sendVerify,
};
//# sourceMappingURL=user.controller.js.map