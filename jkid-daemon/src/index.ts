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

import registerRouter from "./register";
import * as console from "node:console";
app.use("/register", registerRouter);

app.listen(14590, () => {
  console.log("App listening")
})