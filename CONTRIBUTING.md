# Contributing to bright.supply

Thanks for helping improve bright.supply. The project deliberately stays small, dependency-free, accessible, and useful on a wide range of screens.

## Before you start

- Search existing [issues](https://github.com/banastas/bright.supply/issues) and pull requests.
- Keep proposals focused on the screen-light experience.
- For bugs, include reproduction steps, the expected result, the actual result, browser and OS versions, and screenshots when useful.
- Report security problems privately according to [SECURITY.md](SECURITY.md).

## Local setup

You need Git, Node.js 24 or newer, Python 3, and a modern browser. There are no package dependencies to install.

```bash
git clone https://github.com/YOUR_USERNAME/bright.supply.git
cd bright.supply
npm start
```

Open `http://localhost:8000`.

## Source and generated files

The 270 public HTML documents and `sitemap.xml` are generated. Do not edit them directly.

| Change | Source file |
|---|---|
| Colors, translations, route data, or metadata copy | `scripts/site-data.mjs` |
| HTML structure, metadata markup, or sitemap output | `scripts/generate-pages.mjs` |
| Interface behavior | `app.js` |
| Presentation and responsive behavior | `styles.css` |
| Analytics behavior | `analytics.js` |
| Offline behavior | `sw.js` |
| Install metadata | `manifest.json` |

After changing a source file, regenerate and validate the repository with `npm test`.

## Code standards

- Use semantic HTML and native browser controls where possible.
- Preserve keyboard operation, useful accessible names, visible focus, and reduced-motion support.
- Keep CSS responsive from 320 px wide screens through large desktop displays and short landscape viewports.
- Keep JavaScript framework-free and avoid adding runtime dependencies.
- Treat English color slugs and public route paths as stable identifiers.
- Update documentation and tests whenever a public or internal contract changes.
- Do not add direct `gtag()` calls to application code. Use `window.brightSupplyAnalytics.track()` and update the documented event contract.

## Required checks

Run:

```bash
npm test
git diff --check
git status --short
```

`npm test` regenerates the route matrix, validates every generated document and PWA asset, and exercises the application and analytics runtime contracts. `git status --short` should show only intentional changes. Generated output must be committed with its source changes.

For interface changes, also verify:

- Root, direct color, localized, and localized-color routes
- Brightness, presets, temperature, reset, fullscreen, and help
- Keyboard-only navigation and shortcuts
- Settings after a reload
- A 390 px mobile viewport and a short landscape viewport
- Arabic right-to-left layout
- Black-screen controls remain absent
- The browser console has no application errors

For offline changes, confirm that the home and precached color routes open offline, then visit another localized color route online and confirm that exact route can reopen offline.

## Pull requests

Describe what changed, why it changed, and how it was verified. Include before-and-after screenshots for visible changes and call out any changed route, storage, analytics, or caching contract.

By contributing, you agree that your contribution will be licensed under the [MIT License](LICENSE).
