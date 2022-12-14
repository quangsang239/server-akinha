import { IUser, IUserVerification } from "../types/index";
import UserModel from "../model/user.model";
import UserVerifiCationModel from "../model/userVerification";
import { Request, Response, NextFunction } from "express";
import * as _ from "lodash";
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

const sendVerificationEmail = ({ _id, email }: any) => {
  const currentUrl = "http://localhost:1305/api/";
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
  let newUser: any = [];
  for (const user of allUser) {
    console.log(
      _.pick(user, [
        "_id",
        "email",
        "userName",
        "name",
        "phoneNumber",
        "verified",
      ])
    );

    newUser.push(
      _.pick(user, [
        "_id",
        "email",
        "userName",
        "name",
        "phoneNumber",
        "verified",
      ])
    );
  }

  res.status(200).json(newUser);
};
const getUser = async (req: Request, res: Response, _next: NextFunction) => {
  const { userName } = req.params;
  const user: IUser | null = await UserModel.findOne({ userName }).exec();
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
  } else {
    res.status(400).json({ code: 1, message: "Kh??ng t??m th???y ng?????i d??ng!" });
  }
};
const createUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<any> => {
  const { email, userName, password, phoneNumber, name }: IUser = req.body;
  const checkUser: IUser | null = await UserModel.findOne({
    userName: userName,
  }).exec();
  if (checkUser)
    return res
      .status(400)
      .json({ message: "T??i kho???n ???? ???????c ????ng k??!", code: 2 });
  const hashPassword = bcrypt.hashSync(password, SALT_ROUNDS);
  await UserModel.create({
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
        message: "T???o t??i kho???n th??nh c??ng ti???n h??nh ????ng nh???p!",
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
      bcrypt
        .compare(password, user.password)
        .then(async (result) => {
          if (result) {
            const accessToken = jwt.sign({ userId: user._id }, SECRET_KEY, {
              expiresIn: "24h",
            });
            const refreshToken = jwt.sign({ userId: user._id }, REFRESH_KEY);
            await UserModel.findOneAndUpdate(
              { _id: user._id },
              { refreshToken }
            )
              .then(() => {
                res.status(200).json({
                  code: 0,
                  message: "????ng nh???p th??nh c??ng!",
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
          } else
            res
              .status(400)
              .json({ code: 1, message: "Sai t??i kho???n ho???c m???t kh???u!" });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json("Server process failed!");
        });
    } else
      res
        .status(400)
        .json({ code: 1, message: "Sai t??i kho???n ho???c m???t kh???u!" });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server process failed!");
  }
};
const getNewAccessToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
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
    .sort({ createAt: "ascending" })

    .then((result) => {
      if (result.length > 0) {
        const { expiresAt }: IUserVerification = result[result.length - 1];
        const hashedUniqueString = result[result.length - 1].uniqueString;

        if (expiresAt.getTime() < Date.now()) {
          UserVerifiCationModel.deleteMany({ userId })
            .then(() => {
              UserModel.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has expired. Please signup again";
                  res.redirect(
                    `/api/user/verified/error=true&message=${message}`
                  );
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "Clearing user with expired unique string failed";
                  res.redirect(
                    `/api/user/verified/error=true&message=${message}`
                  );
                });
            })
            .catch((error) => {
              console.log(error);
              let message =
                "An error occurred while clearing for expired user verification record";
              res.redirect(`/api/user/verified/error=true&message=${message}`);
            });
        } else {
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result) => {
              if (result) {
                UserModel.updateOne({ _id: userId }, { verified: true })
                  .then(() => {
                    UserVerifiCationModel.deleteMany({ userId })
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
                          `/api/user/verified/error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    let message = "An error while updating user";
                    res.redirect(
                      `/api/user/verified/error=true&message=${message}`
                    );
                  });
              } else {
                let message =
                  "invalid verification details passed. Check your inbox.";
                res.redirect(
                  `/api/user/verified/error=true&message=${message}`
                );
              }
            })
            .catch((error) => {
              console.log(error);
              let message = "An error occurred while comparing unique strings";
              res.redirect(`/api/user/verified/error=true&message=${message}`);
            });
        }
      } else {
        let message =
          "Account record doesn't exit or has been verify already. Please signup and login.";
        res.redirect(`/api/user/verified/error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        "An error occurred while checking for exiting user verification record";
      res.redirect(`/api/user/verified/error=true&message=${message}`);
    });
};
const sendVerify = (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./../views/verified.html"));
};
const updateUser = async (req: Request, res: Response) => {
  const { userName, email, changeEmail, name, phoneNumber } = req.body;
  // const user: IUser | null = await UserModel.findOne({ userName }).exec();
  if (changeEmail) {
    UserModel.findOneAndUpdate(
      { userName },
      {
        email,
        name,
        phoneNumber,
        verified: false,
      }
    )
      .then((result) => {
        if (result) {
          sendVerificationEmail({ _id: result._id, email: email });
          res
            .status(200)
            .json({ code: 0, message: "C???p nh???t t??i kho???n th??nh c??ng!" });
        } else {
          res
            .status(200)
            .json({ code: 2, message: "Kh??ng t??m th???y t??i kho???n!" });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ code: 1, message: "L???i server!" });
      });
  } else {
    UserModel.findOneAndUpdate(
      { userName },
      {
        email,
        name,
        phoneNumber,
      }
    )
      .then(() => {
        res
          .status(200)
          .json({ code: 0, message: "C???p nh???t t??i kho???n th??nh c??ng!" });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ code: 1, message: "L???i server!" });
      });
  }
};
const newPassword = async (req: Request, res: Response) => {
  const { userName, currentPassword, newPassword } = req.body;
  await UserModel.findOne({ userName }).then((result) => {
    if (result) {
      bcrypt.compare(currentPassword, result.password).then(async (value) => {
        if (value) {
          const hashNewPassword = bcrypt.hashSync(newPassword, SALT_ROUNDS);
          await UserModel.findOneAndUpdate(
            { userName },
            {
              password: hashNewPassword,
            }
          )
            .then(() => {
              res
                .status(200)
                .json({ code: 0, message: "?????i m???t kh???u th??nh c??ng!" });
            })
            .catch(() => {
              res.status(500).json({ code: 1, message: "Server L???i!" });
            });
        } else {
          res
            .status(200)
            .json({ code: 2, message: "M???t kh???u hi???n t???i kh??ng ????ng" });
        }
      });
    } else {
      res.status(500).json({ code: 1, message: "Kh??ng t??m th???y t??i kho???n!" });
    }
  });
};
const deleteUser = (req: Request, res: Response) => {
  const { _id } = req.body;
  UserModel.findByIdAndDelete({ _id })
    .then(() => {
      res.status(200).json({ code: 0, message: "Xo?? ng?????i d??ng th??nh c??ng!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ code: 1, message: "Xo?? ng?????i d??ng th???t b???i" });
    });
};
const sendNewVerify = (req: Request, res: Response) => {
  const { userName, email } = req.body;
  UserModel.findOne({ userName })
    .then((result) => {
      if (result) {
        sendVerificationEmail({ _id: result._id, email });
        res.status(200).json("G???i email th??nh c??ng!");
      } else {
        res.status(400).json("G???i email kh??ng th??nh c??ng!");
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json("L???i server!");
    });
};
export default {
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
