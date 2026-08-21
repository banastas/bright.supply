# bright.supply

[![Live Site](https://img.shields.io/badge/Live-bright.supply-00d9ff?style=for-the-badge)](https://bright.supply)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-f7df1e?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<img src="https://github.com/banastas/bright.supply/blob/main/assets/images/readme.png?raw=true" alt="bright.supply showing color, brightness, temperature, fullscreen, and language controls">

Turn any monitor, tablet, or phone into an adjustable fullscreen light.

bright.supply is a free, dependency-free Progressive Web App for video calls, photography, streaming, ambience, display testing, and creative work. Choose one of 14 screen colors, set its intensity, and use the whole display as a light source. No download, account, or sign-up is required.

## Use it

1. Open [bright.supply](https://bright.supply) on a monitor, tablet, or phone.
2. Choose a color and adjust its brightness. White screens also include a cool-to-warm temperature control.
3. Select **Fullscreen** to dedicate the display to light output.

Low, Medium, High, and Max set brightness to 20, 50, 75, and 100 percent. A preset can also be included in any non-black screen URL:

```text
https://bright.supply/white/?preset=max
https://bright.supply/blue/?preset=medium
https://bright.supply/es/orange/?preset=low
```

## Color screens

Every color has a direct, shareable, indexable URL:

| Color | URL | Color | URL |
|---|---|---|---|
| White | [bright.supply/white/](https://bright.supply/white/) | Black | [bright.supply/black/](https://bright.supply/black/) |
| Red | [bright.supply/red/](https://bright.supply/red/) | Pink | [bright.supply/pink/](https://bright.supply/pink/) |
| Magenta | [bright.supply/magenta/](https://bright.supply/magenta/) | Purple | [bright.supply/purple/](https://bright.supply/purple/) |
| Blue | [bright.supply/blue/](https://bright.supply/blue/) | Cyan | [bright.supply/cyan/](https://bright.supply/cyan/) |
| Teal | [bright.supply/teal/](https://bright.supply/teal/) | Green | [bright.supply/green/](https://bright.supply/green/) |
| Lime | [bright.supply/lime/](https://bright.supply/lime/) | Yellow | [bright.supply/yellow/](https://bright.supply/yellow/) |
| Amber | [bright.supply/amber/](https://bright.supply/amber/) | Orange | [bright.supply/orange/](https://bright.supply/orange/) |

The root page remains the general screen-light landing page. `/white/` is the dedicated white-screen search page. Color selection is route-driven, so a bookmarked red page always opens red.

## Languages

Every landing page and color page is available in:

- English
- German
- Spanish
- French
- Indonesian
- Italian
- Polish
- Portuguese
- Vietnamese
- Turkish
- Russian
- Arabic, including right-to-left layout
- Hindi
- Thai
- Simplified Chinese
- Traditional Chinese
- Japanese
- Korean

English uses root-level routes such as `/blue/`. Localized routes use the language first, such as `/es/blue/`, `/ar/blue/`, and `/zh-cn/blue/`. The language picker preserves the current color.

## Features

- Fourteen predefined screen colors
- Direct URLs for every color and language combination
- Adjustable brightness from 0 to 100 percent on light-emitting colors
- A true black screen with brightness, presets, and reset hidden because they cannot alter black
- Cool-to-warm white balance on the home and white-screen routes
- Low, Medium, High, and Max presets, including launchable `?preset=` URLs
- Fullscreen mode and installable PWA shortcuts for White, Red, Blue, and Black
- Keyboard shortcuts that stay out of the way while a control has focus
- Brightness and temperature persistence in `localStorage`
- A language picker that keeps the current color while switching editions
- Responsive left-to-right and right-to-left layouts
- Network-first pages with route-specific offline caching
- Accessible labels, focus styles, touch targets, and adaptive text contrast
- Production-only GA4 page views and product interaction events
- Pure HTML, CSS, and vanilla JavaScript with zero package dependencies

## Keyboard shortcuts

| Key | Action |
|---|---|
| `←` / `→` | Decrease or increase brightness by 5 percent |
| `Space` | Toggle between the current and previous brightness |
| `R` | Reset brightness and white balance |
| `F` | Toggle fullscreen |
| `H` | Toggle keyboard help |
| `1` to `4` | Select Low, Medium, High, or Max |

Keyboard shortcuts do not intercept input, select, or button interactions.

## Search architecture

The repository contains 270 generated static HTML documents: 15 page types across 18 languages. Each document includes:

- A route-specific title, description, and canonical URL
- Exactly one H1, with a compact localized color label on color routes
- Fully qualified, reciprocal `hreflang` links for all 18 editions
- An `x-default` fallback
- Localized Open Graph and Twitter metadata
- `WebApplication` JSON-LD
- Crawlable links to all colors
- A matching entry in `sitemap.xml`

Search-focused phrases remain in metadata and structured data. The working lightbox surface uses only quiet branding and, on color routes, a localized color label, so search copy does not obstruct the utility.

The generated pages, language catalog, validation rules, and sitemap are kept in sync by one build command. See [Routing and SEO](docs/ROUTING_AND_SEO.md) for the complete contract.

## PWA and offline behavior

The service worker precaches the shared app shell plus the home, White, Black, Red, and Blue routes. Other pages use a network-first strategy and keep an exact route-specific copy after a successful visit, so a previously opened localized color screen can be reopened offline. Shared interface files are refreshed from the network when available.

The web app manifest supports fullscreen standalone use, shortcuts to four common screens, and installation on browsers that support PWAs.

## Privacy

Brightness and temperature settings remain in the browser's local storage. The app has no accounts, forms, or server-side user profiles. On the production domain, Google Analytics 4 measures page views and completed product interactions such as color selection, brightness changes, fullscreen use, and PWA installation. Saved settings are not sent on page load. Measured URLs exclude query strings and fragments, Google Signals and ad-personalization signals are disabled, and analytics stays off on localhost and preview hosts. See [Analytics implementation](docs/ANALYTICS.md) for the full event and data contract.

## Development

```bash
git clone https://github.com/banastas/bright.supply.git
cd bright.supply
npm run serve
```

Visit `http://localhost:8000`. Python 3 is used only for the local server. Node.js 14 or newer is required for page generation and validation. There are no packages to install and no framework build step.

After changing routes, colors, translations, metadata, or templates, run:

```bash
npm run build
```

The build regenerates all 270 pages and the sitemap, then runs more than 6,000 checks for syntax, assets, routes, canonicals, reciprocal language alternatives, structured data, analytics coverage, PWA files, and sitemap completeness. `npm test` also executes the analytics runtime contract. Use `npm run validate` when the generated output is already current and only static validation is needed.

## Source layout

```text
bright.supply/
├── index.html                     Generated English landing page
├── {color}/index.html             Generated English color pages
├── {language}/index.html          Generated localized landing pages
├── {language}/{color}/index.html  Generated localized color pages
├── analytics.js                   Production GA4 loader and event adapter
├── app.js                         Shared interactive behavior
├── styles.css                     Shared responsive presentation
├── manifest.json                  PWA manifest
├── sw.js                          Offline and update behavior
├── sitemap.xml                    Generated international sitemap
├── docs/
│   ├── API.md                     Browser API and integration notes
│   ├── ANALYTICS.md               GA4 event, privacy, and reporting contract
│   └── ROUTING_AND_SEO.md         Generated routing and search contract
└── scripts/
    ├── site-data.mjs              Color and translation catalog
    ├── generate-pages.mjs         HTML and sitemap generator
    ├── test-analytics.mjs         Analytics runtime tests
    └── validate.mjs               Release validation
```

Generated HTML and `sitemap.xml` carry a generated-file marker. Edit the catalog or generator, then rebuild. Do not hand-edit generated pages.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Run `npm test` before opening a pull request.

## License

MIT License. See [LICENSE](LICENSE).

## Support

- Website: [bright.supply](https://bright.supply)
- Email: info@bright.supply
- Issues: [GitHub Issues](https://github.com/banastas/bright.supply/issues)
- Twitter: [@banastas](https://twitter.com/banastas)

Made by [banast.as](https://banast.as)
