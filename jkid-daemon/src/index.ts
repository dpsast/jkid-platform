import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

import process from "node:process";
export const webUrl = process.env.WEB_URL || "http://localhost:5173";

import express from "express";
import cors from "cors";
import fs from "node:fs";

const app = express();
app.use(cors({
  origin: webUrl,
  credentials: true
}));
app.use(express.json());

import registerRouter from "./register";
import adminRouter from "./admin";
app.use("/register", registerRouter);
app.use("/admin", adminRouter);

const serverIp = process.env.SERVER_IP || "0.0.0.0";
const serverPort = parseInt(process.env.SERVER_PORT || "14590");

export const autoPassSet: Set<string> = fs.existsSync('auto-pass.txt') ? new Set(
  fs.readFileSync('auto-pass.txt', 'utf8')
    .split('\n')
    .filter(value => value !== '')
) : new Set();

app.listen(serverPort, serverIp, () => {
  console.log(`App listening on ${serverIp === "0.0.0.0" ? "*" : serverIp}:${serverPort}`);
})