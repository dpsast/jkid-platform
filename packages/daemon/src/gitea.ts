import config from './config';

export async function createAccount(params: {
  username: string;
  password: string;
  email: string;
  mustChangePassword: boolean;
}) {
  const response = await fetch(new URL(`admin/users`, config.gitea.baseUrl), {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${config.gitea.token}`,
    },
    body: JSON.stringify({
      email: params.email,
      must_change_password: params.mustChangePassword,
      password: params.password,
      // send_notify: true,
      username: params.username,
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create account: ${response.status} ${response.statusText} - ${errorText}`);
  }
}
