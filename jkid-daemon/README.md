# jkid-daemon

The backend for jkid-platform.

# Before All Begins

jkid-daemon uses `npm`. Run
```shell
npm install
```
to prepare packages.

jkid-daemon uses SQLite, so there's no need to run a separate database. Just run:
```shell
npx prisma generate
npx prisma db push
```

This step of initializing `prisma` is unavoidable so there's no way to pack everything into a single `.js` file.

The database file is located at `/path/to/project/jkid-daemon/prisma/data.db`.

# Deployment

## Building

Simply execute `tsc` to build.

## Configuration

### OAuth Application

Create an OAuth Application on [Tsinghua Git](https://git.tsinghua.edu.cn/-/user_settings/applications). Grant the following scope(s):
- `read_user`

Pay attention to the `Application ID` and `Secret` (you won't see the `Secret` later!)

Create a `.env` file at `/path/to/project/jkid-daemon` directory. Then add the following lines to it:
```properties
GIT_OAUTH_APP_ID="{app_id}"
GIT_OAUTH_APP_SECRET="{app_secret}"
```
Replace `{app_id}` and `{app_secret}` with what you get in the previous step.

Also, you need to specify a redirect URI in your App configuration. It should look like:
```
http(s)://{the domain of id service}/register/continue
```
Add such a line to the `.env` file:
```properties
GIT_OAUTH_APP_REDIRECT_URI="{redirect_uri}"
```

> Hint: An OAuth application accepts multiple redirect URIs. To perform tests locally, you can also add a redirect URI `http://localhost:14590/register/continue` to the application and leave the line mentioned above blank. Then the server will use this default redirect URI.

<details> <summary>If you are using other Git services</summary>

Keep in mind that other Git services may not return the student ID ("学号") as Tsinghua Git does (unfortunately they even may not have the concept of "学号"!) So you may need to modify the source code and the prisma schema file. This limits the extensibility of this application. What a pity!

</details>

### Gitea

Obtain an access token from an admin account. Then add the following line to the `.env` file:
```properties
GITEA_API_ENDPOINT="{url}"
GITEA_ACCESS_TOKEN="{access_token}"
```

Check the port your Gitea service listens to, and complete the `{url}`, for example, `http://localhost:3000/api/v1/`. Note that the API endpoint should always end with `/api/v1/` (pay attention to the last character `/`).

### Auto Pass List

The auto pass list is a list of student IDs that are allowed to pass the registration process without any manual review. The list is stored in a file named `auto-pass.txt` in the root directory of the project. The file should contain one student ID per line.

### Network

Without explicitly configuring, the CORS policy of this daemon only accepts requests from the "source" `http://localhost:5173`, which is the address of Vite dev server. Add the following line to the `.env` file:
```properties
WEB_URL="{url}"
```

Replace `{url}` with the real URL of jkid-web, for example, `https://id.jkparadise.space`.

If your server has multiple IPs, then you can specify an IP for the server to bind by adding such a line:
```properties
SERVER_IP="{ip}"
```

The daemon service listens to port `14590` by default. To change it, add such a line:
```properties
SERVER_PORT={port}
```

## Start the server

Finally, you can run
```shell
npm start
```
to start the server.