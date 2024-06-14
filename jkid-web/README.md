# jkid-web

The frontend for jkid-platform.

## Before All Begins

jkid-web uses `npm`. Run
```shell
npm install
```
to prepare packages.

## Debugging

Run 
```shell
npm run dev
```
to start the test server. The frontend will listen to port `5173` while the backend address it will try to connect 
(if not specified in `.env.local`) will be `http://localhost:14590`.

## Deployment

Create a `.env.local` file at `/path/to/project/jkid-web` directory. Then add the following lines to it:
```properties
VITE_BACKEND_ADDRESS="{backend_url}"
```

Run
```shell
npm run build
```
To build the website for **production** use. The built website will be in `dist` directory, and you can deploy that 
as a static website using any tool or platform (e.g. nginx, apache, GitHub Pages, Vercel, etc.).