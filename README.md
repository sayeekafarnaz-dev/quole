# Quole standalone embed

One dependency-free browser widget and Node backend, isolated from the existing websites and adubio application. No website changes or deployment have been made.

## Run locally

Requires Node 22+ (tested with Node 24.19.0).

```sh
cd /Users/sayeekafarnaz/Documents/quole
cp .env.example .env
npm start
```

Open http://127.0.0.1:4310/demo.html. Use the three site links to preview each context. Without `GEMINI_API_KEY` and `GEMINI_MODEL`, sending displays the service-unavailable fallback. This is not a scripted FAQ: a configured server retrieves approved records and calls Google's Gemini GenerateContent API. Select an available model in the Google AI Studio / Gemini API account; no model availability is assumed. Keys remain server-side. Do not reuse or copy private application environment files.

The launcher currently says **DEV PLACEHOLDER — Replace with original Quole asset**. It is intentionally a labelled rectangle, not a substitute character. Supply the original asset, host it at an approved HTTPS URL and set `QUOLE_ASSET_URL`. The widget renders the asset unchanged. Only a subtle activation tilt is implemented, with reduced-motion handling. Eye movement and blinking await an original layered SVG or approved eye-layer positions; arbitrary animation over a flattened asset would invent details.

DM Sans and DM Serif Display are named in the widget CSS. Set `QUOLE_FONT_CSS_URL` to a self-hosted, approved stylesheet containing the fonts' `@font-face` rules for standalone pages that do not already load these fonts. Without those assets, browser fallback fonts are used. Font files have not been supplied or downloaded.

## Embed code

Replace `QUOLE_HOST` with the confirmed HTTPS origin of this backend. These snippets contain no secrets. Files are in `embeds/`.

qlogue.com:
```html
<script defer src="https://QUOLE_HOST/widget.js" data-site="qlogue"></script>
```
adubio.ai:
```html
<script defer src="https://QUOLE_HOST/widget.js" data-site="adubio"></script>
```
pruque.com:
```html
<script defer src="https://QUOLE_HOST/widget.js" data-site="pruque"></script>
```

Prefer insertion into the top-level page, on every page or a global code hook. Hostnames are detected automatically if `data-site` is omitted; explicit site configuration remains validated against the request Origin on the backend. Duplicate snippets produce only one widget. A mobile sticky navigation or CTA can be accommodated with `data-bottom-offset="64"` (pixels); choose the value after checking the actual site. Desktop placement remains bottom/right 24px.

GoDaddy documents HTML sections supporting HTML, CSS and JavaScript: https://www.godaddy.com/help/add-html-or-custom-code-to-my-site-27252. Confirm the specific site's integration surface before installation. GoDaddy confirms that Websites + Marketing HTML embeds are placed inside an iframe (https://www.godaddy.com/help/troubleshoot-html-or-custom-code-not-displaying-properly-28025). A fixed element cannot escape its frame to sit at the parent page's bottom-right; this implementation deliberately does not attempt cross-origin parent access. It displays a frame warning. If a site offers only framed sections, a site-wide floating launcher needs a supported top-level hook or an agreed section-based alternative. Frame navigation/storage can also prevent website-session persistence. An opaque `Origin: null` is rejected. Do not weaken origin controls to accommodate it.

## Architecture and files

- `public/widget.js`: vanilla JavaScript, Shadow DOM isolation, responsive panel, accessible labelled controls, Escape/minimise, plain-text responses and allowlisted ecosystem links, consent and error/loading states. No React runtime or build step is required for GoDaddy.
- `server/index.js`: startup; `server/app.js`: static assets, config/chat API, validation, origin mapping, abuse controls and LLM transport.
- `server/knowledge.js`: exact openings, operating instructions and deterministic retrieval.
- `knowledge/shared.json`, `qlogue.json`, `adubio.json`, `pruque.json`: allowlisted, maintainable public records with provenance.
- `public/demo.html`: isolated preview; `public/privacy.html`: development privacy draft.
- `embeds/*.html`: separate integration snippets.
- `tests/backend.test.js`, `widget.test.cjs`, `browser.cjs`: backend, DOM and browser checks.
- `.env.example`, `.gitignore`, `package.json`: configuration and commands.

All initial knowledge comes from the user-approved public-facing implementation brief dated 2026-10-04. No private documents, synthetic-bank files, answer keys, source repositories or internal product documentation are retrieved. The retrieval corpus is small, so relevant approved records are ranked by keyword overlap, with shared distinctions and local context always included. Cross-product records are available when relevant. It does not perform web searches or execute model-suggested actions. Add only reviewed public records, with source and review date. Never add broad filesystem ingestion.

No approved PruQue availability matrix exists: its record explicitly prohibits claims that listed capabilities are currently available. Update each capability's current/proposed/future status only when approved public evidence is supplied. Contact links use the approved `enquiries@qlogue.com` address. No enquiry submission, invented contact-form path or booking commitment is implemented. Existing contact/booking routes can be added after their integration is confirmed.

## Environment variables

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development` locally; `production` enables fail-closed startup gates. |
| `HOST`, `PORT` | Default `127.0.0.1:4310`; use the platform-required binding after hosting is confirmed. |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Server credentials and account-supported model. |
| `QUOLE_ORIGINS` | JSON exact origin-to-site map, including confirmed preview origins if needed. HTTPS required in production. |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Public browser challenge key and private server verification key. Both required for production. |
| `QUOLE_ASSET_URL` | Original glasses HTTPS asset; required in production. |
| `QUOLE_PRIVACY_URL` | Approved privacy notice HTTPS URL; required in production. |
| `QUOLE_FONT_CSS_URL` | Optional approved font stylesheet; required for exact fonts if the page does not supply them. |
| `QUOLE_PUBLIC_READY` | Defaults false. Set true only after actual asset, privacy/provider and integration review. |
| `QUOLE_REQUESTS_PER_MINUTE` | Per socket-address request cap, default 10. |
| `QUOLE_DAILY_REQUESTS` | Aggregate process request budget, default 500. |

## Security, privacy and operational limits

Production requires an exact Origin match, correct site binding, and a successful Turnstile token with matching hostname and `quole` action. CORS is not authentication: non-browser callers can forge Origin; challenge verification is the abuse barrier. Challenge requirements cannot be disabled in production. Configure Turnstile's permitted hostnames for each actual top-level integration origin. Verification follows Cloudflare guidance: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/.

Body limit 24KB, up to 16 alternating conversation messages, 2,000 characters per input, four active provider calls, 25-second provider timeout and 600 generated tokens. Responses are completed messages, not streamed. Messages and retrieval records are untrusted, separate from fixed operating instructions. The LLM has no tools, private data access or privileged actions, and output is rendered as text. These architectural boundaries limit injection impact; prompts alone cannot guarantee that a model will always reject injection or produce accurate answers. Live adversarial and product-answer evaluations remain required before public use.

Counters are in memory and reset on restart. Use **one backend process** with edge/WAF rate limits and provider spend caps. Behind a reverse proxy, all requests may share one socket address (conservative rate limiting); the server intentionally ignores spoofable forwarded headers. Do not horizontally scale without implementing a shared rate/budget store and a narrowly trusted proxy address policy. TLS termination, firewalling and platform request-size/body timeout controls must be configured on the chosen host. No public deployment has been performed.

Conversation history is browser session storage, site-specific and tab-scoped, bounded to seven recent turns. It expires after 30 minutes idle while the widget runs or on next widget load, and can be cleared manually. No server conversation database or application conversation logging is used. Browsers may preserve session storage across tab restoration; the idle expiry still applies on load. No analytics integration receives conversation data. Host-page scripts can access session storage: install only on trusted pages and ensure analytics/session-replay tools exclude the widget and storage. The widget cannot control unrelated tools installed by a website owner.

Visitors consent before sending. Messages/history go to Google Gemini; Turnstile processes verification/browser information. Confirm provider retention, region, contractual terms, hosting logs and Qlogue's privacy notice before marking production ready. The application cannot enforce external processor deletion. Keep request-body logging, debug payload capture and session replay disabled. The bundled privacy page is a development draft, not an approved legal notice. Reference provider API documentation: https://ai.google.dev/gemini-api/docs.

## Testing

```sh
npm test
npm install
npm run test:widget
npx playwright install chromium
npm run test:browser
```

Runtime has no npm dependencies. Development dependencies are test-only. `QUOLE_JSDOM_PATH` and `QUOLE_PLAYWRIGHT_PATH` optionally select already-installed test packages; `QUOLE_CHROME_CHANNEL=chrome` selects installed Chrome.

Observed results in this workspace:
- **15/15 backend tests passed**, invoking the actual request handler with simulated HTTP streams. Includes all three openings, origin/context binding, CORS, input/body limits, multi-turn LLM payload, PruQue uncertainty, cross-product retrieval, rate/daily limits, verification checks, production gates and provider fallback.
- **8/8 DOM widget tests passed** with an existing read-only jsdom installation. Includes all three contexts, placeholder/original-asset switch, minimise/Escape/focus, host form preservation, consent, multi-turn sending, safe output/links, restored/cleared/expired history, error retry and CSS accessibility hooks.
- JavaScript syntax checks passed.
- Real-browser suite was attempted but **Chrome startup was blocked by this environment** (SIGABRT/EPERM). Local TCP server startup was also blocked (`listen EPERM`), so handler tests use simulated HTTP streams. Mobile visual layout, real screen-reader interaction, iframe behavior, screenshots and actual end-to-end HTTP transport are not verified here.
- Provider calls in tests are mocked. **No live LLM quality, streaming, latency, injection resistance or real Turnstile interaction has been verified**; no supplied API credentials were used.

The browser suite is included for an unrestricted environment; it uses routed local pages and mocked responses without deploying anything. Complete browser checks, live-provider evaluations and real GoDaddy previews before public integration. No claim is made that existing website functionality has been tested; those sites were not changed.

## Deployment handoff — do not deploy yet

1. Confirm top-level integration hooks (or approved alternatives) and actual origins for each website.
2. Supply the original Quole asset; approve font hosting and eye animation layers.
3. Confirm approved public knowledge and feature-status inventory, contact routes and privacy/provider retention terms.
4. Choose one backend host, configure HTTPS, Turnstile hostnames, secret environment variables, edge protection and spending limits. Install the project; no frontend build is needed.
5. Run backend/DOM/browser tests and live answer/injection evaluations in a private preview. Test actual cross-origin requests and all existing forms, sticky CTAs, keyboard behavior and mobile devices.
6. Only after confirmation, enable production variables and replace `QUOLE_HOST` in the three snippets. Install through each site's supported code integration, then verify placement on every page and history retention during navigation.

Unresolved: original Quole asset/animation layers; exact font assets; approved provider/model/credentials; Turnstile account configuration; final privacy/retention terms; PruQue availability matrix; GoDaddy integration capabilities; final hosting choice; real-browser and live-service verification. Existing adubio files were only read to locate installed test utilities; none were modified.

## Pre-deployment review artifacts

See `docs/deployment-checklist.md` for the exact supply list, per-site placement requirements, GoDaddy iframe finding and verification gates. Open `preview/index.html` directly in a browser for the offline interactive preview built from the actual widget; it sends no messages to an AI service. Rebuild with `node scripts/build-preview.js` after widget changes. `preview/placement-overview.png` is a labelled desktop/mobile placement illustration, not a browser screenshot.

The expanded browser suite saves real screenshots and a JSON report when run on a compatible test machine. Run `scripts/run-browser-checks.sh`; alternatively use `QUOLE_CHROME_CHANNEL=chrome` or an authorised `QUOLE_CHROME_CDP_URL`. The current report remains blocked because Chrome cannot launch in this workspace. No external repository, test service or deployment was created.
