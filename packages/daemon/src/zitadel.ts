import config from './config';

type ZitadelUser = {
  userId: string;
  username: string;
};

type ZitadelListUsersResponse = {
  result?: ZitadelUser[];
};

const zitadelUrl = config.zitadel.baseUrl.replace(/\/$/, '');

const compoundSurnames = [
  '欧阳', '司马', '上官', '诸葛', '东方', '独孤', '南宫', '皇甫', '尉迟', '公孙', '慕容',
  '长孙', '宇文', '闻人', '夏侯', '令狐', '端木', '轩辕', '淳于', '钟离', '仲孙', '鲜于',
  '闾丘', '司徒', '司空', '司寇', '亓官', '梁丘', '左丘', '东郭', '南门', '呼延', '百里',
  '东门', '第五', '胡母', '羊舌', '微生',
];

export function splitRealName(realName: string) {
  const name = realName.trim();
  if (!name) {
    return { familyName: 'jkid', givenName: 'jkid' };
  }

  const dottedName = name.split(/[·.]/u).map((part) => part.trim()).filter(Boolean);
  if (dottedName.length > 1) {
    return { familyName: dottedName[0], givenName: dottedName.slice(1).join('') };
  }

  const familyName = compoundSurnames.find((surname) => name.startsWith(surname));
  if (familyName && name.length > familyName.length) {
    return { familyName, givenName: name.slice(familyName.length) };
  }
  if (name.length > 1) {
    return { familyName: name[0], givenName: name.slice(1) };
  }
  return { familyName: 'jkid', givenName: name };
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${zitadelUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.zitadel.token}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Zitadel API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return (await response.json()) as T;
}

export async function zitadelGetUser(username: string): Promise<ZitadelUser | null> {
  const response = await request<ZitadelListUsersResponse>('/v2/users', {
    method: 'POST',
    body: JSON.stringify({
      limit: 1,
      queries: [
        {
          andQuery: {
            queries: [
              {
                userNameQuery: {
                  userName: username,
                  method: 'TEXT_QUERY_METHOD_EQUALS',
                },
              },
              { organizationIdQuery: { organizationId: config.zitadel.organizationId } },
            ],
          },
        },
      ],
    }),
  });
  return response.result?.[0] ?? null;
}

export async function zitadelCreateUser(params: {
  username: string;
  password: string;
  email: string;
  realName: string;
  mustChangePassword: boolean;
}) {
  const profile = splitRealName(params.realName);
  await request('/v2/users/new', {
    method: 'POST',
    body: JSON.stringify({
      organizationId: config.zitadel.organizationId,
      username: params.username,
      human: {
        profile,
        email: { email: params.email, isVerified: true },
        password: { password: params.password, changeRequired: params.mustChangePassword },
      },
    }),
  });
}

export async function zitadelChangePassword(username: string, newPassword: string) {
  const user = await zitadelGetUser(username);
  if (!user) {
    throw new Error(`Zitadel user not found: ${username}`);
  }
  await request(`/v2/users/${encodeURIComponent(user.userId)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      human: {
        password: { password: newPassword, changeRequired: false },
      },
    }),
  });
}
