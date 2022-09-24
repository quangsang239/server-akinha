import { IUser, IUserVerification } from "../types/index";
import UserModel from "../model/user.model";
import UserVerifiCationModel from "../model/userVerification";
import { Request, Response, NextFunction } from "express";
import {
  SECRET_KEY,
  REFRESH_KEY,
  SALT_ROUNDS,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
} from "../config/config";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { v4 as uuidV4 } from "uuid";
import path from "path";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message!!");
    console.log(success);
  }
});

const sendVerificationEmail = ({ _id, email }: IUser) => {
  const currentUrl = "http://localhost:1305/";
  const uniqueString = uuidV4() + _id;
  const mailOptions = {
    from: EMAIL_USERNAME,
    to: email,
    subject: "Verify Your Email!!!",
    html: `<p>Verify your email address to complete signup and login</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
      currentUrl + "user/verify/" + _id + "/" + uniqueString
    }>here</a> to proceed.</p>`,
  };
  bcrypt
    .hash(uniqueString, SALT_ROUNDS)
    .then((hashedUniqueString) => {
      UserVerifiCationModel.create({
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

const getAllUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const allUser: IUser[] = await UserModel.find({}).exec();
  res.status(200).json(allUser);
};
const getUser = async (req: Request, res: Response, _next: NextFunction) => {
  const { email } = req.body;
  const user: IUser | null = await UserModel.findOne(email).exec();
  res.status(200).json(user);
};
const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  const { email, userName, password } = req.body;
  console.log({ email, userName, password });
  const checkUser: IUser | null = await UserModel.findOne({
    userName: userName.toLowerCase(),
  }).exec();
  if (checkUser)
    return res.status(400).json({ message: "user is exited!", code: 2 });
  const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  await UserModel.create({
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
const loginUser = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body;
    const user: IUser | null = await UserModel.findOne({
      userName,
    }).exec();
    if (user) {
      bcrypt.compare(password, user.password).then(async () => {
        const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
          expiresIn: "15m",
        });
        const refreshToken = jwt.sign({ userId: user._id }, REFRESH_KEY);
        await UserModel.findOneAndUpdate({ _id: user._id }, { refreshToken })
          .then(() => {
            console.log("create refresh token success!");
          })
          .catch((error) => {
            console.log(error);
          });
        res.status(200).json({
          message: "Login Success!",
          accessToken: accessToken,
          refreshToken: refreshToken,
          userName,
        });
      });
    } else res.status(400).json({ message: "User not found!" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server process failed!");
  }
};
const getNewAccessToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    console.log(req.cookies);
    const { refreshToken, userName } = req.body;
    jwt.verify(
      token,
      SECRET_KEY,
      { ignoreExpiration: true },
      async (err, decoded) => {
        if (err) {
          res.status(400).json({ message: "Access token incorrect!" });
        } else {
          console.log(decoded);
          const user: IUser | null = await UserModel.findOne({
            userName,
          }).exec();
          if (user) {
            if (user.refreshToken === refreshToken) {
              const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
                expiresIn: "15m",
              });
              res
                .status(200)
                .json({ message: "new access token", accessToken });
            } else {
              res.status(400).json({ message: "refresh token incorrect!" });
            }
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
};
const userVerify = (req: Request, res: Response) => {
  const userId = req.params.userId;
  const uniqueString = req.params.uniqueString;

  UserVerifiCationModel.find({ userId })
    .then((result) => {
      console.log({ result });
      if (result.length > 0) {
        const { expiresAt }: IUserVerification = result[0];
        const hashedUniqueString = result[0].uniqueString;

        if (expiresAt.getTime() < Date.now()) {
          UserVerifiCationModel.deleteOne({ userId })
            .then(() => {
              UserModel.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has expired. Please signup again";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "Clearing user with expired unique string failed";
                  res.redirect(`/user/verified/error=true&message=${message}`);
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                "An error occurred while clearing for expired user verification record";
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                UserModel.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerifiCationModel.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname, "./../views/verified.html")
                        );
                      })
                      .catch((error) => {
                        console.log(error);
                        let message =
                          "An error while finalizing successful verification";
                        res.redirect(
                          `/user/verified/error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message = "An error while updating user";
                    res.redirect(
                      `/user/verified/error=true&message=${message}`
                    );
                  });
              } else {
                let message =
                  "invalid verification details passed. Check your inbox.";
                res.redirect(`/user/verified/error=true&message=${message}`);
              }
            })
            .catch((error) => {
              console.log(error);
              let message = "An error occurred while comparing unique strings";
              res.redirect(`/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        let message =
          "Account record doesn't exit or has been verify already. Please signup and login.";
        res.redirect(`/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        "An error occurred while checking for exiting user verification record";
      res.redirect(`/user/verified/error=true&message=${message}`);
    });
};
const sendVerify = (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
};
export default {
  createUser,
  getAllUser,
  getUser,
  loginUser,
  getNewAccessToken,
  userVerify,
  sendVerify,
};
