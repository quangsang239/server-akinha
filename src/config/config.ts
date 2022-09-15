import dotenv from "dotenv";
dotenv.config();

export const urlConnection = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@akinha.rmwryg9.mongodb.net/test`;
export const port = process.env.SERVER_PORT || 9090;
export const SECRET_KEY =
  process.env.SECRET_KEY || "mbx14SAYVWe0RgweHMHZIIaSGOFTmETv";
