# Quole development handover

Saved project: `/Users/sayeekafarnaz/Documents/quole`
Handover archive: `/Users/sayeekafarnaz/Documents/quole-handover.zip`

The project remains standalone. No adubio application or live website was modified, and nothing was deployed. Browser execution in this restricted environment has stopped. Runtime architecture and existing passing tests are preserved.

## Open the interactive preview

1. Extract `quole-handover.zip` into a folder of your choice.
2. Open `quole/preview/index.html` in your browser (double-click or use File → Open).
3. Use the Qlogue, adubio and PruQue links to change context. Minimise/open the panel and scroll to inspect bottom-right placement. Narrow the browser window to explore the mobile layout.

No server, npm installation, API key or internet connection is needed for this offline preview. Sending is disabled: no chat message is sent to an external AI service. The labelled development launcher remains pending the original Quole glasses. The PNGs in `preview/` are placement illustrations, not real-browser screenshots. Current typography uses fallbacks pending approved font assets.

## Included

- Widget, backend and three approved knowledge configurations.
- Offline interactive preview and labelled desktop/mobile illustrations.
- Three separate snippets in `embeds/qlogue.html`, `adubio.html` and `pruque.html`.
- `.env.example` with empty credential fields and public deployment disabled.
- README, detailed deployment checklist, scripts and existing test sources.

Excluded: `node_modules`, real environment files/secrets, Git metadata, caches, logs, runtime test reports and unnecessary build artefacts. The preview is intentionally included because it is a requested handover deliverable.

## GoDaddy integration limits

GoDaddy confirms that Websites + Marketing HTML custom-code sections run inside an iframe:
https://www.godaddy.com/help/troubleshoot-html-or-custom-code-not-displaying-properly-28025

A widget inserted there is confined to the section; it cannot provide a fixed overlay over the entire parent page. For page-wide floating Quole, use a confirmed supported top-level global script/footer hook, such as the main page footer/template on an editable hosting setup or an appropriate WordPress integration. The matching site snippet belongs once in that hook on every page, normally before `</body>`.

If only Websites + Marketing HTML sections are available, the alternatives are to obtain confirmation of a supported third-party top-level hook from GoDaddy, or explicitly agree a section-contained assistant instead of a floating launcher. That section alternative still requires frame-origin, sizing and navigation checks. GoDaddy's built-in chat integration is not evidence of support for arbitrary third-party scripts. Do not use analytics/pixel fields as a workaround.

The product/plan and exact account hook for each of the three websites remain unconfirmed. See `deployment-checklist.md` for per-site placement, all required supplies and deployment gates. Do not install the adubio.ai marketing snippet in the private adubio application.

## Checks and outstanding work

Previously passing checks, preserved without rerunning browsers during handover:
- 15 backend request-handler tests, with simulated HTTP streams and mocked provider responses.
- 8 DOM widget tests.
- JavaScript syntax checks and offline-preview DOM smoke check.

Still unverified:
- Real Chrome rendering and interaction, responsive/mobile screenshots and actual end-to-end HTTP transport.
- Physical-device safe areas, software keyboard, screen readers and actual-site sticky navigation/CTA overlap.
- Live LLM generation, response quality, latency and adversarial prompt-injection behavior. Responses are not streamed in this implementation.
- Real Turnstile challenge behavior, production origin/CORS behavior, TLS/WAF configuration and provider spending controls.
- Each site's actual GoDaddy integration, page-wide placement, navigation history and existing-functionality regression checks.
- Original glasses appearance and eye animations, exact font assets, final contact/booking routes and PruQue current/proposed/future availability evidence.
- Approved external-provider privacy, retention, region and hosting-log configuration.

No browser test pass or deployment success is claimed. Browser tests require a separate environment that permits Chrome; scripts and test sources are included for that later work. The prior blocked browser runtime report is intentionally excluded from the archive; the blocked status is recorded here and in the checklist.
