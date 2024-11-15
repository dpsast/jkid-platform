import {PrismaClient} from '@prisma/client';
import process from "node:process";
import express from "express";
import fs from "node:fs";
import registerRouter from "./register";
import adminRouter from "./admin";
import path from "node:path";

export const prisma = new PrismaClient();

const app = express();
app.use(express.json());

const staticPath = path.resolve('..', 'jkid-web', 'dist');
if (!fs.existsSync(staticPath)) {
  console.log('Static page not found. Please run `npm run build` in jkid-web first.');
  process.exit(1);
}
app.use(express.static(staticPath));

const apiRouter = express.Router();
apiRouter.use("/register", registerRouter);
apiRouter.use("/admin", adminRouter);
app.use("/api", apiRouter);

app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const serverIp = process.env.SERVER_IP || "0.0.0.0";
const serverPort = parseInt(process.env.SERVER_PORT || "14590");

export const autoPassSet: Set<string> = fs.existsSync('auto-pass.txt') ? new Set(
  fs.readFileSync('auto-pass.txt', 'utf8')
    .split('\n')
    .filter(value => value !== '' && !value.startsWith('#'))
) : new Set();

app.listen(serverPort, serverIp, () => {
  console.log(`App listening on ${serverIp === "0.0.0.0" ? "*" : serverIp}:${serverPort}`);
})