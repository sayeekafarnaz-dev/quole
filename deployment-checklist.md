# Quole pre-deployment checklist

Status: **not deployed; no live website or adubio application has been modified.**

## What you need to supply

| Supply | Where it goes | Needed for |
|---|---|---|
| Original Quole glasses asset, preferably SVG or transparent PNG/WebP | Provide the file in the isolated `quole/` project or attach it; after inspection, publish the unchanged asset to the chosen asset host and set `QUOLE_ASSET_URL` | Replacing the labelled development launcher. No substitute character will be created. |
| Approved eye layers/positions or original animation assets, if available | Original asset package; implementation in `public/widget.js` only | Blinking and subtle eye movement without redesign. Flat images can currently tilt only. |
| Licensed DM Sans and DM Serif Display font files or an approved existing font stylesheet | Approved HTTPS font host; set `QUOLE_FONT_CSS_URL` | Exact standalone typography. Current previews use system fallbacks. |
| GoDaddy product and plan **for each domain** | Record in the website table below | Establishing whether there is a supported top-level script hook. Websites + Marketing HTML sections are framed. |
| Site administrator confirmation of a top-level custom-script insertion point; private preview URL if available | Record its exact editor field/theme hook in the table | Floating over the entire page and loading on every page. No live edits are authorised yet. |
| Chrome-capable local machine, isolated CI repository, or remote Chrome/CDP endpoint | Run `scripts/run-browser-checks.sh`, or configure `QUOLE_CHROME_CDP_URL` and run the suite | Real-browser screenshots, mobile rendering and interaction tests. Keep credential-bearing endpoints out of chat/logs. |
| Backend hosting choice and approved HTTPS origin | Replace `QUOLE_HOST` in all three `embeds/*.html` files; configure TLS and `HOST`/`PORT` | Hosting one shared service. A suggested domain is not a provisioned or approved domain. |
| Anthropic account API key and account-supported model ID | Hosting platform's **secret environment settings**: `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Real generative answers. Do not paste keys into snippets or share them in chat. |
| Cloudflare Turnstile site key and secret, configured for confirmed hostnames | Public `TURNSTILE_SITE_KEY`; secret `TURNSTILE_SECRET_KEY` in backend environment | Production verification and abuse protection. |
| Final website and private-preview origins | Backend `QUOLE_ORIGINS` exact origin-to-context JSON | CORS and server-enforced site context. Include `www` variants if used. Do not allow wildcard or opaque `null` origins. |
| Approved public knowledge and PruQue feature-status inventory | Review `knowledge/*.json`; supply public sources and current/proposed/future status | Accurate product claims. Current PruQue availability is unconfirmed. |
| Actual advisory/demo/licensing/contact and booking URLs, if preferred over email | Reviewed public contact records; explicit widget links if needed | Existing visitor enquiry flows. `enquiries@qlogue.com` is already supported. |
| Approved privacy notice URL and external-processing/retention terms | `QUOLE_PRIVACY_URL`; provider account retention/region settings; platform log configuration | Anthropic, Cloudflare and hosting processing disclosure. The bundled notice is a development draft. |
| Edge rate limits, provider spending cap and single-process hosting configuration | Host/WAF/provider consoles; `QUOLE_REQUESTS_PER_MINUTE`, `QUOLE_DAILY_REQUESTS` | Public abuse/cost controls. Application counters reset on restart; multi-instance operation needs shared counters first. |
| Confirmation of existing mobile sticky navigation/CTA height and existing chatbot position | Private-site browser verification; set `data-bottom-offset` only if needed | Preventing launcher overlap on the actual websites. |

## GoDaddy finding and decision

GoDaddy explicitly documents that its **Websites + Marketing HTML embed is inside an iframe**:
https://www.godaddy.com/help/troubleshoot-html-or-custom-code-not-displaying-properly-28025

The documented editor path is **Manage → Edit Website → Add Section → HTML → Custom Code**:
https://www.godaddy.com/help/add-html-or-custom-code-to-my-site-27252

That section is suitable for a section-contained embed, **not the requested page-wide floating Quole**. The launcher would be fixed relative to the iframe, clipped to its bounds, and move with the HTML section when the parent page scrolls. Increasing section height does not turn it into an overlay. Backend origin checks may also reject the iframe's origin; actual frame origin must be established before supporting a section alternative.

GoDaddy's own Conversations chat has a dedicated built-in integration, but that does not establish that arbitrary third-party scripts can use the same hook. Do not put Quole into analytics/pixel settings or replace the existing website/chat service as a workaround.

If a website uses GoDaddy WordPress or ordinary editable hosting, a supported global footer hook/page template can execute this script in the top-level document. The exact account/editor hook is **unconfirmed** for all three sites; no universal GoDaddy field can honestly be specified yet. Confirm the product first. If only framed HTML sections are available, ask GoDaddy about a supported third-party top-level script integration or explicitly agree a section-contained alternative. The original floating requirement remains blocked without a top-level hook.

Suggested support question (prepared only; not sent):
> Does this site's product and plan support inserting an external JavaScript script into the top-level document on every page, outside the Websites + Marketing HTML iframe? If yes, what exact editor field or supported hook should be used? We need a fixed bottom-right launcher, not a section-contained widget.

## Where each website's embed belongs

For a confirmed supported top-level integration, install the matching script **once in the site's global footer/template immediately before `</body>`**, or in its documented global footer-script field that executes in the main page. It must cover every page. Keep all snippets out of the private adubio application.

| Public website | Prepared embed file | Required placement | Confirmed account hook |
|---|---|---|---|
| qlogue.com | `embeds/qlogue.html` — `data-site="qlogue"` | Public Qlogue website's top-level global footer, before `</body>` | Pending GoDaddy product/plan and site-admin confirmation |
| adubio.ai | `embeds/adubio.html` — `data-site="adubio"` | Public adubio marketing website's top-level global footer, before `</body>`; **not `/Users/sayeekafarnaz/adubio`** | Pending GoDaddy product/plan and site-admin confirmation |
| pruque.com | `embeds/pruque.html` — `data-site="pruque"` | Public PruQue website's top-level global footer, before `</body>` | Pending GoDaddy product/plan and site-admin confirmation |

```html
<!-- qlogue.com, after confirmation -->
<script defer src="https://QUOLE_HOST/widget.js" data-site="qlogue"></script>
```
```html
<!-- adubio.ai public website, after confirmation -->
<script defer src="https://QUOLE_HOST/widget.js" data-site="adubio"></script>
```
```html
<!-- pruque.com, after confirmation -->
<script defer src="https://QUOLE_HOST/widget.js" data-site="pruque"></script>
```

If private preview proves a sticky mobile bar is 64px high, add `data-bottom-offset="64"` to that site's script. This is an example value, not an approved measurement.

Do not paste these scripts into a live site or press Publish at this stage.

## Verification gates

- [x] Isolated runtime and public knowledge configurations implemented.
- [x] Existing backend and DOM tests passed (15 and 8 respectively).
- [x] Offline interactive preview built from the actual widget code; no message leaves the preview.
- [x] Desktop/mobile placement illustrations generated, explicitly labelled **not browser screenshots**.
- [x] GoDaddy's documented iframe restriction confirmed from its official help page.
- [ ] Original glasses supplied, inspected, integrated and shown in an updated preview.
- [ ] Exact fonts supplied/approved.
- [ ] Chrome-capable environment provided; real-browser suite passes and screenshots reviewed.
- [ ] Browser checks on 360×640, 375×667, 390×844, tablet and landscape sizes; touch context; keyboard, host form, scroll/fixed placement, history, consent, retry, links and reduced motion. The prepared suite mocks AI responses; this is not a live-answer evaluation.
- [ ] Actual-device checks for software keyboard, safe-area insets, screen readers, sticky CTAs and browser storage behavior. Chromium emulation alone does not verify these.
- [ ] Live provider and Turnstile tests in an approved private environment; product-answer and prompt-injection evaluations.
- [ ] Each site's actual integration origin, top-level placement and navigation behavior verified in private preview.
- [ ] Provider privacy/retention, contact routes, knowledge, TLS/WAF/spend caps and logging approved.
- [ ] Deployment explicitly authorised later. Only then set `NODE_ENV=production`, supply all production variables, and set `QUOLE_PUBLIC_READY=true`.
- [ ] After authorised integration, verify each live page, existing forms/navigation/CTAs and rollback by removing its one script. Stop the backend separately if public chat needs disabling.

## Test-environment handoff

On an unrestricted Chrome/Chromium-capable machine, copy **only this isolated Quole project** and run:

```sh
cd quole
./scripts/run-browser-checks.sh
```

This installs test tools and Chromium, runs the existing suites and writes actual browser screenshots plus `report.json` to `test-results/browser/`. It never deploys anything or loads the three live sites. Test responses are mocked.

If Chrome is already installed:
```sh
npm install
QUOLE_CHROME_CHANNEL=chrome npm run test:browser
```

If an existing authorised remote Chrome endpoint is provided, set `QUOLE_CHROME_CDP_URL` in that test machine's environment and run `npm run test:browser`. The suite opens an isolated browser context and uses routed local fixtures. Supply endpoint credentials through secure configuration. Use a dedicated test browser rather than a personal session.

Latest attempt here: Chrome exits with SIGABRT/EPERM before page tests begin; Docker socket access is denied. No remote test environment is connected. `test-results/browser/report.json` therefore says **blocked**, not passed. A screenshot-like placement illustration is not substituted for browser verification.
