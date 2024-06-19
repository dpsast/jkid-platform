import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

import * as process from "node:process";
export const webUrl = process.env.WEB_URL || "http://localhost:5173";

import express from "express";
import cors from "cors";

const app = express();
app.use(cors({
  origin: webUrl,
  credentials: true
}));
app.use(express.json());

import registerRouter from "./register";
import * as console from "node:console";
import adminRouter from "./admin";
app.use("/register", registerRouter);
app.use("/admin", adminRouter);

app.listen(14590, () => {
  console.log("App listening")
})