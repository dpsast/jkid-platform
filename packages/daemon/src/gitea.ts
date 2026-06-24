import { giteaApi, type User } from 'gitea-js';

import config from './config';

const gitea = giteaApi(config.gitea.baseUrl, {
  token: config.gitea.token, // generate one at https://gitea.example.com/user/settings/applications
});

export async function giteaGetUser(username: string): Promise<User | null> {
  const response = await gitea.users.userGet(username);
  if (!response.ok) {
    return null;
  }
  return response.data;
}

export async function giteaCreateUser(params: {
  username: string;
  password: string;
  email: string;
  mustChangePassword: boolean;
}) {
  const response = await gitea.admin.adminCreateUser({
    username: params.username,
    password: params.password,
    email: params.email,
    must_change_password: params.mustChangePassword,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create user: ${response.status} ${response.statusText} - ${errorText}`);
  }
}
