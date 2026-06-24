import { Hono } from 'hono';
import { getOauthAccessToken, getUserInfo } from 'thugit-oauth';

import autoPassSet from '../autopass';
import config from '../config';
import { giteaCreateUser, giteaGetUser } from '../gitea';
import { requestStorage } from '../storage';

import { randomUUID } from 'node:crypto';

const register = new Hono();

register.get('/fire', (c) => {
  return c.redirect(
    `https://git.tsinghua.edu.cn/oauth/authorize?client_id=${
      config.tsinghuaGit.oauthAppId
    }&redirect_uri=${encodeURIComponent(
      config.tsinghuaGit.oauthRedirectUri,
    )}&response_type=code&state=STATE&scope=read_user`,
  );
});

register.get('/callback', async (c) => {
  try {
    const authorizationCode = c.req.query('code');
    if (!authorizationCode) {
      return c.text('Missing code parameter', 400);
    }
    const accessToken = await getOauthAccessToken(
      config.tsinghuaGit.oauthAppId,
      config.tsinghuaGit.oauthAppSecret,
      authorizationCode,
      config.tsinghuaGit.oauthRedirectUri,
    );
    const info = await getUserInfo(accessToken);

    const user = await giteaGetUser(info.username);
    if (user) {
      const requestId = randomUUID();
      requestStorage.set(requestId, info);
      return c.redirect(`/password-reset?${new URLSearchParams({ requestId, username: info.username }).toString()}`);
    }

    if (autoPassSet.has(info.studentId)) {
      const tempPassword = randomUUID();
      await giteaCreateUser({
        username: info.username,
        password: tempPassword,
        email: info.email,
        mustChangePassword: true,
      });
      return c.redirect(`/auto-pass?${new URLSearchParams({ username: info.username, tempPassword }).toString()}`);
    } else {
      const requestId = randomUUID();
      const base64Payload = Buffer.from(JSON.stringify(info)).toString('base64');
      requestStorage.set(requestId, info);
      return c.redirect(`/register?${new URLSearchParams({ requestId, base64Payload }).toString()}`);
    }
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    return c.text(
      `Internal Server Error: ${error instanceof Error ? error.message : 'Unknown error'}, please try again`,
      500,
    );
  }
});

export default register;
