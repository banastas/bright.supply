# bright.supply

[![Live Site](https://img.shields.io/badge/Live-bright.supply-00d9ff?style=for-the-badge)](https://bright.supply)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-f7df1e?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<img src="https://github.com/banastas/bright.supply/blob/main/assets/images/readme.png?raw=true" alt="bright.supply fullscreen color light controls">

Turn any monitor, tablet, or phone into an adjustable fullscreen light.

bright.supply is a dependency-free Progressive Web App for video calls, photography, streaming, ambience, display testing, and creative work. It provides 14 color screens, 18 localized editions, brightness controls, white balance, presets, keyboard control, and offline support.

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
- Adjustable brightness from 0 to 100 percent
- Cool-to-warm white balance on white screens
- Low, Medium, High, and Max presets
- Fullscreen mode
- Keyboard shortcuts
- Brightness and temperature persistence
- Responsive left-to-right and right-to-left layouts
- Installable PWA with route-aware offline caching
- Accessible labels, focus styles, touch targets, and adaptive text contrast
- Zero runtime dependencies

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

The repository contains 270 generated static HTML documents: 15 page types across 18 languages. Each document ships useful content without waiting for JavaScript and includes:

- A unique title, description, canonical URL, and H1
- Fully qualified, reciprocal `hreflang` links for all 18 editions
- An `x-default` fallback
- Localized Open Graph and Twitter metadata
- `WebApplication` JSON-LD
- Crawlable links to all colors
- A matching entry in `sitemap.xml`

The generated pages, language catalog, validation rules, and sitemap are kept in sync by one build command. See [Routing and SEO](docs/ROUTING_AND_SEO.md) for the complete contract.

## Development

```bash
git clone https://github.com/banastas/bright.supply.git
cd bright.supply
python3 -m http.server 8000
```

Visit `http://localhost:8000`. There are no packages to install and no framework build step.

After changing routes, colors, translations, metadata, or templates, run:

```bash
npm run build
```

The build regenerates all 270 pages and the sitemap, then runs more than 4,000 checks for syntax, assets, routes, canonicals, reciprocal language alternatives, structured data, PWA files, and sitemap completeness.

## Source layout

```text
bright.supply/
├── index.html                     Generated English landing page
├── {color}/index.html             Generated English color pages
├── {language}/index.html          Generated localized landing pages
├── {language}/{color}/index.html  Generated localized color pages
├── app.js                         Shared interactive behavior
├── styles.css                     Shared responsive presentation
├── manifest.json                  PWA manifest
├── sw.js                          Offline and update behavior
├── sitemap.xml                    Generated international sitemap
└── scripts/
    ├── site-data.mjs              Color and translation catalog
    ├── generate-pages.mjs         HTML and sitemap generator
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
