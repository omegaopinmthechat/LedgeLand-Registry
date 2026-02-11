import { config } from "dotenv";

config();

const port = process.env.PORT;

if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

if (isNaN(port)) {
  throw new Error("PORT must be a number");
}

export const PORT = Number(port);
