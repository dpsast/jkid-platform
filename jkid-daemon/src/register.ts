import express from "express";
import urlEncode from "urlencode";
import * as process from "node:process";

import jwt from "jsonwebtoken";
import {prisma, autoPassSet} from "./index";

import {validator} from "@exodus/schemasafe";
import {accept} from "./admin";
import {randomUUID} from "node:crypto";

const oauthAppId = process.env.GIT_OAUTH_APP_ID;
const oauthAppSecret = process.env.GIT_OAUTH_APP_SECRET;
const oauthRedirectUri = process.env.GIT_OAUTH_APP_REDIRECT_URI || "http://localhost:14590/api/register/continue"

const registerRouter = express.Router();

registerRouter.get("/fire", (_req, res) => {
  res.redirect(`https://git.tsinghua.edu.cn/oauth/authorize?client_id=${
    process.env.GIT_OAUTH_APP_ID
  }&redirect_uri=${
    urlEncode(oauthRedirectUri)
  }&response_type=code&state=STATE&scope=read_user`);
});

registerRouter.get("/continue", async (req, res) => {
  if (!req.query.code) {
    res.status(400).end();
  }

  try {
    const data = <any>await fetch("https://git.tsinghua.edu.cn/oauth/token", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: oauthAppId,
        client_secret: oauthAppSecret,
        code: req.query.code,
        grant_type: "authorization_code",
        redirect_uri: oauthRedirectUri
      } as Record<string, string | readonly string[]>).toString(),
    }).then(res => res.json());

    // console.log(data);
    const access_token = data.access_token;

    const userInfo = <any>await fetch("https://git.tsinghua.edu.cn/api/v4/user", {
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    }).then(res => res.json());

    if (!userInfo.name || !userInfo.email) {
      res.status(502).json("Internal Error").end();
      return;
    }

    const name = userInfo.name; // Real name
    const username = userInfo.username;
    const studentId = userInfo.identities[0].extern_uid; // Tsinghua University Student ID
    const email = userInfo.email;

    if (autoPassSet.has(studentId)) {
      const tempPassword = randomUUID();
      await accept(username, email, tempPassword);
      res.redirect(`/auto-pass?${new URLSearchParams({username, tempPassword}).toString()}`);
      return;
    }

    const payload = {name, username, studentId, email}

    const token = jwt.sign(payload, <string>oauthAppSecret);
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

    res.redirect(`/register?${new URLSearchParams({token, base64Payload}).toString()}`);
  } catch (_err) {
    res.status(502).end();
  }
});

const registerSubmitValidator = validator({
  type: "object",
  properties: {
    token: { type: "string" },
    password: { type: "string", maxLength: 64 },
    department: { type: "string" },
    reason: { type: "string" },
  },
  additionalProperties: false,
  required: ["token", "password", "department", "reason"],
});

registerRouter.post("/submit", async (req, res) => {
  if (!registerSubmitValidator(req.body)) {
    res.status(400).end();
    return;
  }

  const { token, password, department, reason } = req.body;
  try {
   const { name, username, studentId, email } = <any> jwt.verify(token, <string>oauthAppSecret);
   await prisma.pendingUsers.create({
     data: {
       studentId: parseInt(studentId),
       name, username, email, password, department, reason
     }
   });
   res.status(201).end();
  } catch (_err) {
    res.status(400).end();
    return;
  }
})

export default registerRouter;