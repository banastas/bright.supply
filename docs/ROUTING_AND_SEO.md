# Routing, localization, and search contract

bright.supply is deployed as a static site. Every public search URL must therefore resolve to a real HTML file without relying on client-side routing or JavaScript metadata changes.

## Route matrix

The build produces 270 documents:

- 18 localized landing pages
- 14 color pages in each of 18 languages

English is the default and has no language prefix:

```text
/
/white/
/red/
/blue/
```

Other languages use a stable language prefix while color slugs remain stable:

```text
/es/
/es/white/
/es/red/
/ar/blue/
/zh-cn/purple/
```

All canonical URLs include a trailing slash. Query-string brightness presets are application launch options, not separate search pages, and do not appear in the sitemap.

## Source of truth

Edit [site-data.mjs](../scripts/site-data.mjs) to change:

- Supported colors and their RGB values
- Temperature support
- Locales, display names, paths, and text direction
- Control labels, feedback, headings, descriptions, and metadata

Edit [generate-pages.mjs](../scripts/generate-pages.mjs) to change HTML structure, metadata, structured data, route output, or sitemap generation.

Run `npm run build` after any source change. The generator removes and recreates only known generated route directories, then the validator checks the complete public contract.

## International search signals

Every page includes:

- A self-referencing canonical URL
- A reciprocal `hreflang` link for every supported language
- A self-reference within the `hreflang` set
- `hreflang="x-default"` pointing to the English equivalent
- A matching language selector option that preserves the selected color
- A matching sitemap entry with the same complete alternate set

No automatic language redirect is used. Users and crawlers can choose a language, and each language URL remains independently accessible. This follows [Google Search Central guidance for localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions).

## Page-level search content

Each generated document contains localized, server-readable content before JavaScript runs:

- A unique `<title>`
- A useful meta description
- One localized H1
- A localized lead and feature summary
- Open Graph and Twitter metadata
- `WebApplication` structured data
- Crawlable links to the full color set
- Indexable robots directives

Color and language pages use self-referencing canonicals because their content and user intent are distinct. The landing page and `/white/` also have separate titles, descriptions, headings, and intent: the first introduces the complete tool while the second targets a dedicated white-screen experience.

## Adding a color

1. Add a unique `slug` and six-digit `hex` value to `colors`.
2. Add the color name to every locale.
3. Set `temperature: true` only when the color should expose white-balance controls.
4. Run `npm run build`.
5. Test the new English and localized URLs at desktop, mobile, and short landscape sizes.

The route count, color navigation, language preservation, canonical metadata, reciprocal alternatives, structured data, sitemap, and service-worker cache targets are validated automatically.

## Adding a language

1. Add a complete locale to `locales`.
2. Use a valid ISO 639-1 `code` for `hreflang`. Script variants such as `zh-Hans` and `zh-Hant` are supported.
3. Add `path` only when the public route should differ from the lowercased code.
4. Set `dir: 'rtl'` for right-to-left writing systems.
5. Translate all control, metadata, heading, lead, feedback, and color-name fields.
6. Run `npm run build`.
7. Have a fluent speaker review the generated edition before production deployment.

The validator rejects incomplete color dictionaries, duplicate codes or paths, missing pages, broken alternates, missing language options, duplicated titles, and sitemap drift.

## Release checks

```bash
npm test
git diff --check
```

For production, also confirm:

- Root, color, localized, and localized-color routes return HTTP 200
- Nested routes load `/styles.css`, `/app.js`, and `/manifest.json`
- `sitemap.xml` is publicly reachable and current
- Canonical URLs match the live trailing-slash behavior
- A viewed route remains available offline
- Desktop, 390 px mobile, short landscape, and Arabic RTL layouts do not overlap or overflow
- The browser console is free of application errors
