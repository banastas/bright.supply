# bright.supply API Documentation

## JavaScript API

The `BrightSupply` class provides a programmatic interface to control the lightbox functionality.

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
Resets brightness to maximum (1000).

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

#### `isPhBadgeVisible`
Whether the Product Hunt badge is visible.

### Events

The class doesn't emit custom events, but you can listen to DOM events:

```javascript
// Listen for brightness changes
document.getElementById('brightness').addEventListener('input', (e) => {
    console.log('Brightness changed to:', e.target.value);
});
```

## URL Parameters

The app supports URL parameters for preset brightness:

- `?preset=low` - Set to low brightness
- `?preset=medium` - Set to medium brightness  
- `?preset=high` - Set to high brightness
- `?preset=max` - Set to maximum brightness

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` | Decrease brightness |
| `→` | Increase brightness |
| `Space` | Toggle brightness |
| `R` | Reset to maximum |
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
    "showPhBadge": false,
    "timestamp": 1703001234567
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
- Background sync capabilities
- Push notification support (future)

## Examples

### Basic Usage

```javascript
// Initialize the app
const app = new BrightSupply();

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
