import { giteaApi, type User } from 'gitea-js';

import config from './config';

const gitea = giteaApi(config.gitea.baseUrl, {
  token: config.gitea.token, // generate one at https://gitea.example.com/user/settings/applications
});

export async function giteaGetUser(username: string): Promise<User | null> {
  try {
    const response = await gitea.users.userGet(username);
    return response.data;
  } catch (error) {
    if (error instanceof Response && error.status === 404) return null;
    throw error;
  }
}

export async function giteaCreateUser(params: {
  username: string;
  password: string;
  email: string;
  mustChangePassword: boolean;
}) {
  try {
    await gitea.admin.adminCreateUser({
      username: params.username,
      password: params.password,
      email: params.email,
      must_change_password: params.mustChangePassword,
    });
  } catch (error) {
    if (error instanceof Response) {
      const errorText = await error.text();
      throw new Error(`Failed to create user: ${error.status} ${error.statusText} - ${errorText}`);
    }
    throw error;
  }
}

export async function giteaChangePassword(username: string, newPassword: string) {
  try {
    await gitea.admin.adminEditUser(username, {
      login_name: 'empty', // by default
      source_id: 0, // by default
      password: newPassword,
      must_change_password: false,
    });
  } catch (error) {
    if (error instanceof Response) {
      const errorText = await error.text();
      throw new Error(`Failed to change password: ${error.status} ${error.statusText} - ${errorText}`);
    }
    throw error;
  }
}
