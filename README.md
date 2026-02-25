# bright.supply

[![Live Site](https://img.shields.io/badge/Live-bright.supply-00d9ff?style=for-the-badge)](https://bright.supply)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-f7df1e?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<img src="https://github.com/banastas/bright.supply/blob/main/assets/images/readme.png?raw=true" alt="bright.supply - Lightbox for video calls">

**Use your 2nd monitor as a lightbox for video calls.**

A lightweight PWA that turns any screen into an adjustable light source for video conferencing, content creation, and photography. No dependencies, no install required — just open it in your browser.

## Features

- **Adjustable brightness** — Fine-tune light intensity from 0-100% with a smooth slider
- **Color temperature** — Shift from cool (blue-white) to warm (amber) to match your environment
- **Preset levels** — One-click access to Low, Medium, High, and Max brightness
- **Fullscreen mode** — Maximize light output across your entire screen
- **Keyboard shortcuts** — Full keyboard control for quick adjustments
- **Settings persistence** — Remembers your brightness and temperature preferences
- **PWA ready** — Install as a standalone desktop or mobile app
- **Accessible** — Full keyboard navigation, ARIA labels, and screen reader support
- **Zero dependencies** — Pure HTML, CSS, and vanilla JavaScript

## How to Use

1. **Open** [bright.supply](https://bright.supply) on your second monitor
2. **Adjust** brightness and color temperature using the sliders
3. **Go fullscreen** for maximum light output
4. **Position** your camera to capture the light
5. **Look great** on your next video call

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Decrease / increase brightness by 5% |
| `Space` | Toggle between current and previous brightness |
| `R` | Reset to defaults (75% brightness, neutral temperature) |
| `F` | Toggle fullscreen |
| `H` | Toggle help panel |
| `1` - `4` | Quick presets (Low, Medium, High, Max) |

### Preset Levels

| Preset | Brightness | Best for |
|--------|-----------|----------|
| **Low** | 20% | Subtle fill light in dark rooms |
| **Medium** | 50% | Balanced, general-purpose lighting |
| **High** | 75% | Bright key light for calls |
| **Max** | 100% | Maximum brightness output |

## Use Cases

- **Video conferencing** — Look better on Zoom, Teams, Meet, and WebEx
- **Content creation** — Better lighting for streaming, recording, and podcasting
- **Photography** — Softbox alternative for product photos and flat-lays
- **Presentations** — Eliminate shadows for interviews, webinars, and online teaching

## Technical Details

- **Pure HTML/CSS/JavaScript** — No frameworks, no build step, no dependencies
- **Progressive Web App** — Installable on desktop and mobile, works offline
- **Accessible** — WCAG-friendly with full keyboard navigation and screen reader support
- **Cross-platform** — Works on Windows, macOS, Linux, iOS, and Android
- **Lightweight** — ~40KB total page weight (~15KB gzipped)

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | Supported |
| Firefox | 55+ | Supported |
| Safari | 12+ | Supported |
| Edge | 79+ | Supported |

## Installation

### As a Web App (PWA)
1. Visit [bright.supply](https://bright.supply)
2. Click the install prompt in your browser's address bar
3. Launch from your desktop or app drawer

### As a Bookmark
1. Bookmark [bright.supply](https://bright.supply)
2. Open on your second monitor when needed

## Development

```bash
git clone https://github.com/banastas/bright.supply.git
cd bright.supply

# No dependencies to install — just start a local server
python3 -m http.server 8000
# or
npx http-server -p 8000
# or just open index.html directly
```

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/your-feature`)
3. **Commit** your changes
4. **Push** to the branch
5. **Open** a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.

## Support

- **Website**: [bright.supply](https://bright.supply)
- **Email**: info@bright.supply
- **Issues**: [GitHub Issues](https://github.com/banastas/bright.supply/issues)
- **Twitter**: [@banastas](https://twitter.com/banastas)

---

**Made by [banast.as](https://banast.as)**
