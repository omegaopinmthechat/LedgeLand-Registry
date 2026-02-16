import { config } from "dotenv";

config();

// PORT is optional for serverless environments like Vercel
export const PORT = process.env.PORT ? Number(process.env.PORT) : 5500;
