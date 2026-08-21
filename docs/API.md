# bright.supply API Documentation

## JavaScript API

The `BrightSupply` class provides a programmatic interface to control the lightbox functionality.

The current page route selects the base screen color. For example, `/red/` selects red and `/es/red/` selects the same color with Spanish content and controls.

### Constructor

```javascript
const brightSupply = new BrightSupply();
```

### Methods

#### `updateBrightness()`
Updates the brightness level and UI elements.

#### `setPreset(preset)`
Sets brightness to a predefined preset.

**Parameters:**
- `preset` (string): One of `'low'`, `'medium'`, `'high'`, `'max'`

**Example:**
```javascript
brightSupply.setPreset('medium');
```

#### `resetBrightness()`
Resets brightness and color temperature to the default state: 75% brightness and neutral temperature.

#### `toggleFullscreen()`
Toggles fullscreen mode.

#### `adjustBrightness(delta)`
Adjusts brightness by a specific amount.

**Parameters:**
- `delta` (number): Amount to adjust (-1000 to 1000)

**Example:**
```javascript
brightSupply.adjustBrightness(100); // Increase by 10%
```

#### `toggleBrightness()`
Toggles between current and previous brightness levels.

### Properties

#### `currentBrightness`
Current brightness level (0-1000).

#### `previousBrightness`
Previous brightness level (0-1000).

#### `isFullscreen`
Whether the app is in fullscreen mode.

#### `currentTemperature`
Current color temperature level (0-100).

#### `baseColor`
RGB object loaded from the generated page's `data-color-value` attribute.

#### `supportsTemperature`
Whether the current route exposes white-balance controls. This is true for white screens and false for fixed-color screens.

#### `supportsBrightness`
Whether brightness controls and shortcuts apply to the current route. This is false for black because brightness scaling cannot change `#000000`.

### Events

The class reports product interactions through `window.brightSupplyAnalytics.track()`. The adapter is active only on the production hostname. Application code never calls `gtag()` directly.

```javascript
window.brightSupplyAnalytics.track('brightness_change', {
    brightness_percent: 50,
    interaction_method: 'custom_integration'
});
```

The adapter accepts GA4-compatible event names plus string, number, or boolean parameters. It adds page kind, screen color, content language, and display mode. Invalid names and values are ignored. See [Analytics implementation](ANALYTICS.md) for the supported product events and GA4 custom-definition setup.

You can also listen to the underlying DOM events for a separate integration:

```javascript
// Listen for brightness changes
document.getElementById('brightness').addEventListener('input', (e) => {
    updatePreview(e.target.value);
});
```

## URL Parameters

The app supports URL parameters for preset brightness:

- `?preset=low` - Set to low brightness
- `?preset=medium` - Set to medium brightness  
- `?preset=high` - Set to high brightness
- `?preset=max` - Set to maximum brightness

Preset parameters are launch options. They are not included in the sitemap and do not replace the canonical page URL.

## URL Routes

Colors use stable path segments:

- `/white/`
- `/black/`
- `/red/`
- `/pink/`
- `/magenta/`
- `/purple/`
- `/blue/`
- `/cyan/`
- `/teal/`
- `/green/`
- `/lime/`
- `/yellow/`
- `/amber/`
- `/orange/`

Localized pages add a language prefix and preserve the color slug, such as `/es/red/`, `/ar/blue/`, and `/ja/white/`. English remains at root-level paths.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Decrease brightness |
| `→` | Increase brightness |
| `Space` | Toggle brightness |
| `R` | Reset to defaults |
| `F` | Toggle fullscreen |
| `H` | Toggle instructions |
| `1` | Set low preset |
| `2` | Set medium preset |
| `3` | Set high preset |
| `4` | Set max preset |

## Storage

Settings are automatically saved to `localStorage` with the key `brightSupplySettings`:

```javascript
{
    "brightness": 750,
    "temperature": 50
}
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## PWA Features

The app is a Progressive Web App with:

- Service Worker for offline functionality
- Web App Manifest for installation
- Network-first navigation with a route-specific offline fallback
- Cache-first static assets
- URL launch shortcuts for white, red, blue, and black screens

## Examples

### Basic Usage

```javascript
// Access the app initialized on page load
const app = window.brightSupply;

// Set to medium brightness
app.setPreset('medium');

// Adjust brightness
app.adjustBrightness(-200);

// Toggle fullscreen
app.toggleFullscreen();
```

### Custom Integration

```javascript
// Listen for brightness changes
const slider = document.getElementById('brightness');
slider.addEventListener('input', (e) => {
    const brightness = e.target.value;
    // Send to your video conferencing app
    sendToVideoApp({ brightness: brightness / 1000 });
});
```

### URL-based Presets

```javascript
// Check URL parameters on load
const urlParams = new URLSearchParams(window.location.search);
const preset = urlParams.get('preset');

if (preset && ['low', 'medium', 'high', 'max'].includes(preset)) {
    app.setPreset(preset);
}
```
