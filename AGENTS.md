# Repository guide for coding agents

bright.supply is a dependency-free static PWA that turns a screen into an adjustable fullscreen light. Production is [bright.supply](https://bright.supply).

## Non-negotiable workflow

1. Search the repository before adding a new implementation.
2. Edit source files, never generated route documents by hand.
3. Run `npm test` after source changes.
4. Run `git diff --check` and inspect `git status --short` before finishing.
5. Keep generated output with the source change that produced it.
6. Do not claim a deployment or live result without checking the production surface.

## Architecture

- `scripts/site-data.mjs`: colors, translations, route data, metadata copy, and sitemap modification date
- `scripts/generate-pages.mjs`: source template for all generated HTML and `sitemap.xml`
- `app.js`: shared application controller
- `styles.css`: shared responsive presentation
- `analytics.js`: production-host-only GA4 adapter
- `sw.js`: offline and cache behavior
- `manifest.json`: install metadata and shortcuts
- `scripts/validate.mjs`: generated route, SEO, asset, PWA, and repository contract checks
- `scripts/test-runtime.mjs`: application and analytics runtime tests
- `docs/`: detailed routing, analytics, and browser API contracts

The build produces 270 documents: the home page plus 14 color pages in each of 18 languages. English uses root routes. Other languages use a locale prefix. The generator marks every generated file.

## Commands

```bash
npm start       # local server at http://localhost:8000
npm run generate
npm run validate
npm test        # complete quality gate
```

Node.js 24 or newer is required. Python 3 is used only for the local server. The app has no package dependencies or bundler.

## Product contracts

- Public color and locale routes are stable, trailing-slash URLs.
- The root and white routes support brightness and white balance.
- Fixed-color routes support brightness but not white balance.
- Black hides brightness, presets, reset, and related shortcuts because scaling black has no visible effect.
- Settings stay in `localStorage` under `brightSupplySettings`.
- Keyboard shortcuts must not intercept interaction with inputs, selects, buttons, textareas, or editable content.
- Localized routes need complete reciprocal `hreflang`, canonical, metadata, structured-data, picker, and sitemap coverage.
- Analytics must remain disabled outside `bright.supply` and `www.bright.supply`. Application code must use the shared adapter rather than calling `gtag()`.
- Pages navigate network-first and retain exact visited routes for offline reuse. Shared interface assets refresh from the network when available.

## Change guidance

- Add or change colors and locales in `scripts/site-data.mjs`, then regenerate.
- Change generated HTML only through `scripts/generate-pages.mjs`.
- Bump the package version and service-worker cache name together for a release that changes cached assets or behavior.
- Keep semantic HTML, native controls, visible focus, reduced-motion support, and adaptive contrast.
- Verify desktop, 390 px mobile, short landscape, and Arabic RTL layouts after visible changes.
- Preserve the zero-runtime-dependency design unless the user explicitly approves an architectural change.
