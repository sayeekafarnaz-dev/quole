# Deploy Quole on Render

## Recommended path: GitHub + Render Blueprint

1. Put this `quole` folder in a private GitHub repository.
2. In Render, choose **New > Blueprint** and connect the repository.
3. Render reads `render.yaml`, builds the Dockerfile and creates the `quole` web service.
4. Enter the secret values when prompted / under **Environment**:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
   - `TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
   - `QUOLE_PRIVACY_URL`
5. Deploy. Render should mark the service healthy via `/health`.
6. Confirm `https://<your-service>.onrender.com/health` returns `{ "ok": true }`.
7. Confirm `https://<your-service>.onrender.com/quole.png` loads the approved Quole asset.
8. Update each embed snippet to use the final Render base URL.

## Required environment values

`NODE_ENV=production`

`HOST=0.0.0.0`

`GEMINI_API_KEY=<secret>`

`GEMINI_MODEL=gemini-3.8-flash`

`TURNSTILE_SITE_KEY=<Cloudflare Turnstile site key>`

`TURNSTILE_SECRET_KEY=<Cloudflare Turnstile secret>`

`QUOLE_ORIGINS={"https://qlogue.com":"qlogue","https://www.qlogue.com":"qlogue","https://adubio.ai":"adubio","https://www.adubio.ai":"adubio","https://pruque.com":"pruque","https://www.pruque.com":"pruque"}`

`QUOLE_PUBLIC_READY=true`

`QUOLE_PRIVACY_URL=<approved public HTTPS privacy notice>`

Optional:

`QUOLE_REQUESTS_PER_MINUTE=10`

`QUOLE_DAILY_REQUESTS=500`

`QUOLE_ASSET_URL` can remain unset because the approved Quole image is bundled at `/quole.png`.

`QUOLE_FONT_CSS_URL` can remain unset unless you want a hosted custom font stylesheet.

## Render settings if you create the Web Service manually

- Service type: **Web Service**
- Runtime: **Docker**
- Dockerfile: `./Dockerfile`
- Health check path: `/health`
- Root directory: leave blank if the repository root is the `quole` folder; otherwise set it to the folder that contains `Dockerfile`
- Start command: leave blank (Dockerfile `CMD` handles startup)
- Port: do not hard-code it in Render. Quole reads Render's `PORT` environment variable.

## After deploy

The widget script is served from:

`https://<your-service>.onrender.com/widget.js`

Quole's public health endpoint is:

`https://<your-service>.onrender.com/health`

Do not expose API keys in website embed code. They stay in Render Environment only.
