import express from "express";
import {prisma} from "./index";

const giteaApiEndpoint = process.env.GITEA_API_ENDPOINT || "http://localhost:3000/api/v1/";
const giteaAccessToken = process.env.GITEA_ACCESS_TOKEN

const adminRouter = express.Router();

const allowedIps = [
  '127.0.0.1', // localhost IPv4
  '::1', // localhost IPv6
  '::ffff:127.0.0.1', // WSL localhost
];

adminRouter.use("/", (req, res, next) => {
  console.log("IP", req.ip, "accessed path", `/admin${req.path}`);
  if (req.ip && allowedIps.includes(req.ip)) {
    next();
  } else {
    res.status(403).end();
  }
});

adminRouter.get("/list", async (_req, res) => {
  const results = await prisma.pendingUsers.findMany();
  res.json(results);
});

adminRouter.get("/accept", async (req, res) => {
  const id = parseInt(req.query.id as string);
  if (isNaN(id)) {
    res.status(400).end();
    return;
  }

  const permitted = await prisma.pendingUsers.findUnique({
    where: {
      studentId: id,
    }
  });
  if (!permitted) {
    res.status(404).end();
    return;
  }

  await accept(permitted.username, permitted.email, permitted.password)
    .then(res => res.ok)
    .then(async ok => {
      if (ok) {
        await prisma.pendingUsers.delete({
          where: { studentId: permitted.studentId }
        });
        res.json(permitted);
      } else {
        res.status(502).end();
      }
      return ok;
    });
});

export async function accept(username: string, email: string, password: string) {
  return fetch(new URL(`admin/users`, giteaApiEndpoint), {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `token ${giteaAccessToken}`
    },
    body: JSON.stringify({
      "email": email,
      "must_change_password": true,
      "password": password,
      // "send_notify": true,
      "username": username,
    }),
  })
}

adminRouter.get("/reject", async (req, res) => {
  const id = parseInt(req.query.id as string);
  if (isNaN(id)) {
    res.status(400).end();
    return;
  }

  try {
    const permitted = await prisma.pendingUsers.delete({
      where: {
        studentId: id,
      }
    });
    res.json(permitted);
  } catch (_err) {
    res.status(404).end();
  }
});

export default adminRouter;