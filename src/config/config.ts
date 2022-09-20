import dotenv from "dotenv";
dotenv.config();

export const urlConnection = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@akinha.rmwryg9.mongodb.net/test`;
export const port = process.env.SERVER_PORT || 9090;
export const SECRET_KEY =
  process.env.SECRET_KEY || "mbx14SAYVWe0RgweHMHZIIaSGOFTmETv";
export const REFRESH_KEY =
  process.env.REFRESH_KEY || "isLtqfdWsjFG9T2vAz6Ju6eHFAbjW8SW";
export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 3;
export const KEY_SESSION =
  process.env.KEY_SESSION || "FXhuh9QEcVo5ETWCIScUF4uAUvEcPZ3M";
