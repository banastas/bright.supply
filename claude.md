# bright.supply 💡

## Project Overview

A lightweight Progressive Web App (PWA) that turns your second monitor into an adjustable lightbox for video calls. Built with pure HTML, CSS, and vanilla JavaScript with no dependencies.

**Live Site:** https://bright.supply

### Purpose
Provide better lighting for video conferencing by utilizing a second monitor as a software-based fill light or key light. Perfect for remote workers, content creators, and anyone who wants to look better on video calls without investing in expensive lighting equipment.

### Key Features
- Adjustable brightness slider (0-100%)
- Color temperature control (cool to warm)
- Keyboard shortcuts for quick adjustments
- Preset brightness levels (Low, Medium, High, Max)
- Fullscreen mode for maximum light output
- Settings persistence via localStorage
- Progressive Web App (installable)
- Fully accessible (ARIA labels, keyboard navigation)
- Zero dependencies
- Works offline with Service Worker

## Tech Stack

- **Core:** Vanilla HTML5, CSS3, JavaScript ES6+
- **Architecture:** Class-based JavaScript (BrightSupply class)
- **Storage:** localStorage for settings persistence
- **PWA:** Service Worker + Web App Manifest
- **Analytics:** Google Analytics 4
- **Deployment:** Static hosting (any CDN/web server)

### No Dependencies
This project intentionally uses no frameworks, libraries, or build tools:
- No React, Vue, or Angular
- No jQuery or utility libraries
- No CSS frameworks (custom CSS only)
- No build step or bundler
- Pure vanilla JavaScript

## Project Structure

```
bright.supply/
├── index.html              # Main HTML file with semantic markup
├── styles.css              # All CSS styles (17KB)
├── app.js                  # Main application logic (17KB)
├── manifest.json           # PWA manifest for installation
├── sw.js                   # Service Worker for offline functionality
├── package.json            # Project metadata (no dependencies)
├── robots.txt              # SEO configuration
├── sitemap.xml             # XML sitemap
├── LICENSE                 # MIT License
├── README.md               # User documentation
├── CONTRIBUTING.md         # Contributor guidelines
├── assets/
│   └── images/
│       ├── bright.supply.png  # App icon/logo
│       └── readme.png         # Screenshot for GitHub
└── docs/
    └── API.md              # API documentation (if applicable)
```

## Key Files

### HTML (index.html)
Main application structure with:
- **Meta tags:** SEO, OpenGraph, Twitter Cards
- **Semantic HTML5:** header, main, sections with ARIA labels
- **Controls:**
  - Brightness slider (0-1000 range for precision)
  - Color temperature slider (0-100)
  - Preset buttons (Low, Medium, High, Max)
  - Reset and Fullscreen buttons
  - Help toggle for keyboard shortcuts
- **Google Analytics:** GA4 tracking
- **Service Worker:** PWA registration
- **Accessibility:** Full ARIA labels and keyboard support

### CSS (styles.css)
Custom styling with:
- **CSS Variables:** Consistent theming
- **Responsive Design:** Mobile-first approach
- **High Contrast:** Support for reduced motion and high contrast modes
- **Smooth Transitions:** Polished UI animations
- **Fullscreen Mode:** Optimized for lightbox usage
- **Gradient Background:** Dynamic brightness rendering
- **Custom Slider Styling:** Cross-browser compatible range inputs

### JavaScript (app.js)
Class-based architecture with:
- **BrightSupply Class:** Main application controller
- **State Management:** Brightness, temperature, fullscreen, help visibility
- **Event Handlers:** Keyboard shortcuts, slider changes, button clicks
- **Persistence:** localStorage for saving settings
- **Fullscreen API:** Cross-browser fullscreen support
- **Accessibility:** Keyboard navigation and ARIA updates

### Service Worker (sw.js)
PWA functionality:
- **Caching Strategy:** Cache-first for static assets
- **Offline Support:** Works without internet connection
- **Version Control:** Cache versioning for updates
- **Resource Caching:** HTML, CSS, JS, images

### Manifest (manifest.json)
PWA installation:
- **App Name:** bright.supply
- **Short Name:** bright.supply
- **Description:** Lightbox for video calls
- **Display Mode:** Standalone
- **Theme Color:** #fccd03 (yellow)
- **Icons:** Multiple sizes for different platforms
- **Start URL:** /
- **Orientation:** Any

## Application Architecture

### BrightSupply Class

#### Properties
- `brightnessSlider` - Brightness input element
- `brightnessValue` - Display element for brightness percentage
- `temperatureSlider` - Color temperature input element
- `currentBrightness` - Current brightness value (0-1000)
- `previousBrightness` - Previous brightness (for toggle)
- `currentTemperature` - Current temperature value (0-100)
- `isFullscreen` - Fullscreen state
- `isHelpVisible` - Help panel visibility state
- `presets` - Brightness preset values

#### Methods
- `init()` - Initialize app, load settings, setup listeners
- `setupEventListeners()` - Attach all event handlers
- `updateBrightness()` - Update background brightness
- `updateTemperature()` - Update color temperature
- `setPreset(preset)` - Apply brightness preset
- `resetBrightness()` - Reset to maximum brightness
- `toggleFullscreen()` - Enter/exit fullscreen mode
- `toggleInstructions()` - Show/hide help panel
- `handleKeydown(e)` - Process keyboard shortcuts
- `loadSettings()` - Load from localStorage
- `saveSettings()` - Save to localStorage
- `updateTextColors(percentage)` - Adjust text contrast
- `updateSliderFill()` - Update slider visual fill

## Features in Detail

### Brightness Control
- **Range:** 0-100% (internally 0-1000 for precision)
- **Slider:** Smooth, continuous adjustment
- **Visual Feedback:** Real-time percentage display
- **Background:** CSS gradient from black to white
- **Persistence:** Saves to localStorage

### Color Temperature
- **Range:** Cool (blue-white) to Warm (yellow-orange)
- **Visual Labels:** "Cool" and "Warm" indicators
- **CSS Filters:** Hue rotation and saturation adjustments
- **Use Cases:** Match room lighting or personal preference

### Keyboard Shortcuts
- **←/→** - Decrease/Increase brightness by 5%
- **Space** - Toggle between current and previous brightness
- **R** - Reset to maximum brightness (100%)
- **F** - Toggle fullscreen mode
- **H** - Toggle help panel
- **1-4** - Quick presets (Low, Medium, High, Max)

### Preset Levels
- **Low (20%):** Subtle fill light for dark environments
- **Medium (50%):** Balanced lighting for general use
- **High (75%):** Bright key light for professional calls
- **Max (100%):** Maximum brightness output

### Fullscreen Mode
- Uses native Fullscreen API
- Cross-browser support (standard + webkit + moz + MS)
- Maximizes screen real estate for light output
- Button updates to show current state
- Keyboard shortcut (F) for quick toggle

### Settings Persistence
Saves to localStorage:
- Current brightness value
- Current temperature value
- Fullscreen preference (optional)
- Automatically loads on page refresh
- Graceful degradation if localStorage unavailable

### Accessibility Features
- **ARIA Labels:** All controls properly labeled
- **Keyboard Navigation:** Full keyboard support
- **Screen Reader:** Descriptive announcements
- **High Contrast:** Respects user preferences
- **Reduced Motion:** Respects prefers-reduced-motion
- **Semantic HTML:** Proper heading hierarchy
- **Focus Indicators:** Visible focus states

## Use Cases

### Video Conferencing
- **Zoom, Teams, Meet, WebEx:** Improve appearance
- **Fill Light:** Reduce shadows on face
- **Key Light:** Main light source when positioned correctly
- **Consistent Lighting:** Eliminate room lighting variations

### Content Creation
- **Streaming:** Better lighting for live streams
- **Recording:** Professional look for videos
- **Podcasting:** Video podcasts with better lighting
- **YouTube:** Content creation with improved visuals

### Photography
- **Product Photos:** Small products or flat-lays
- **Softbox Alternative:** Diffused light source
- **Fill Light:** Secondary light for portrait photography
- **Light Painting:** Creative light source

### Presentations
- **Online Presentations:** Better visibility
- **Webinars:** Professional appearance
- **Interviews:** Remote job interviews
- **Teaching:** Online teaching and tutoring

## Development Workflow

### Setup
```bash
# Clone repository
git clone https://github.com/banastas/bright.supply.git
cd bright.supply

# No dependencies to install!
# Just open in browser or start a local server

# Option 1: Python server
python -m http.server 8000
# or
python3 -m http.server 8000

# Option 2: Node.js server (if you have http-server)
npx http-server -p 8000

# Option 3: Just open the file
open index.html
```

Visit `http://localhost:8000` in your browser.

### Testing
No automated tests, but manual testing checklist:
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile devices (iOS, Android)
- Test keyboard shortcuts (all combinations)
- Test preset buttons (all four presets)
- Test fullscreen mode (enter and exit)
- Test settings persistence (refresh page)
- Test accessibility (keyboard only, screen reader)
- Test offline mode (disconnect network)

### Making Changes
1. Edit `index.html`, `styles.css`, or `app.js`
2. Refresh browser to see changes
3. Test thoroughly (see checklist above)
4. Commit with descriptive message
5. Push to repository

### Building/Deploying
No build step required:
- All files are production-ready as-is
- Upload to any static web host
- Works with Netlify, Vercel, GitHub Pages, etc.
- CDN-friendly (all resources cacheable)

## SEO Implementation

### Meta Tags
Comprehensive meta tags in `index.html`:
- **Primary:** Title, description, keywords, author
- **OpenGraph:** og:type, og:url, og:title, og:description, og:image
- **Twitter Cards:** twitter:card, twitter:title, twitter:description, twitter:image
- **Theme Color:** #fccd03 (yellow brand color)
- **Robots:** Index, follow

### Sitemap
XML sitemap at `sitemap.xml`:
- Homepage with priority 1.0
- Daily update frequency
- Last modified timestamp

### Robots.txt
Search engine directives:
- Allow all crawlers
- Sitemap reference
- No restricted directories

### Structured Data (Future)
Could add Schema.org WebApplication markup for rich snippets.

## PWA Implementation

### Manifest (manifest.json)
```json
{
  "name": "bright.supply - Lightbox for Video Calls",
  "short_name": "bright.supply",
  "description": "Use your 2nd monitor as a lightbox for video calls",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#fccd03",
  "background_color": "#000000",
  "icons": [...]
}
```

### Service Worker (sw.js)
- **Cache Strategy:** Cache-first for performance
- **Offline Mode:** Works without internet
- **Version Control:** Cache name includes version
- **Resources Cached:** HTML, CSS, JS, images, manifest
- **Update Strategy:** New version invalidates old cache

### Installability
Users can install as:
- **Desktop App:** Windows, macOS, Linux, ChromeOS
- **Mobile App:** iOS (Add to Home Screen), Android
- **Progressive Enhancement:** Works as website if not installed

## Browser Compatibility

### Desktop Browsers
| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 60+ | ✅ Full support |
| Firefox | 55+ | ✅ Full support |
| Safari | 12+ | ✅ Full support |
| Edge | 79+ | ✅ Full support |

### Mobile Browsers
| Browser | Platform | Status |
|---------|----------|--------|
| Safari | iOS 12+ | ✅ Full support |
| Chrome | Android | ✅ Full support |
| Samsung Internet | Android | ✅ Full support |
| Firefox | Mobile | ✅ Full support |

### Feature Support
- **Range Input:** All modern browsers
- **Fullscreen API:** All modern browsers (with prefixes)
- **localStorage:** All modern browsers
- **Service Worker:** All modern browsers
- **CSS Variables:** All modern browsers
- **ES6 Classes:** All modern browsers

## Performance Optimization

### Asset Optimization
- **HTML:** 6KB (minifiable to ~4KB)
- **CSS:** 17KB (minifiable to ~12KB)
- **JavaScript:** 17KB (minifiable to ~10KB)
- **Total Page Weight:** ~40KB uncompressed
- **Gzipped:** ~15KB total
- **Images:** PNG icon (optimized)

### Loading Performance
- **Preload:** Critical CSS and main image
- **Inline Critical CSS:** Could inline for faster FCP
- **Defer Non-Critical JS:** Service worker registration deferred
- **Async Analytics:** Google Analytics loads asynchronously

### Runtime Performance
- **Smooth Animations:** CSS transitions, no layout thrashing
- **Debouncing:** Slider changes don't trigger excessive updates
- **Efficient DOM:** Minimal DOM manipulation
- **No Frameworks:** Zero framework overhead
- **Memory Management:** No memory leaks, proper cleanup

## Common Tasks

### Adjusting Brightness Presets
Edit preset values in `app.js`:
```javascript
this.presets = {
    low: 200,      // 20%
    medium: 500,   // 50%
    high: 750,     // 75%
    max: 1000      // 100%
};
```

### Changing Theme Color
Edit CSS variable in `styles.css`:
```css
:root {
    --primary-color: #fccd03; /* Yellow */
}
```

### Adding New Keyboard Shortcuts
Add to `handleKeydown()` method in `app.js`:
```javascript
handleKeydown(e) {
    switch(e.key.toLowerCase()) {
        case 'yournewkey':
            // Your functionality
            break;
    }
}
```

### Modifying Temperature Range
Adjust color filter calculations in `updateTemperature()`:
```javascript
updateTemperature() {
    const temp = parseInt(this.temperatureSlider.value);
    // Modify hue-rotate and saturate values
}
```

### Customizing Help Panel
Edit the instructions HTML in `index.html`:
```html
<div class="instructions" id="instructions">
    <!-- Add/modify shortcuts -->
</div>
```

## Analytics

### Google Analytics 4
- Tracks page views
- Tracks user interactions (optional - could add events)
- Property ID: G-DP3EWLQT9L
- Privacy-friendly (no PII collected)

### Potential Custom Events
Could track:
- Brightness adjustments
- Preset button usage
- Fullscreen toggles
- Keyboard shortcut usage
- Installation events

## Deployment

### Static Hosting
Works on any static web host:
- **Netlify** - Zero config deployment
- **Vercel** - Automatic HTTPS
- **GitHub Pages** - Free hosting
- **Cloudflare Pages** - Edge deployment
- **Firebase Hosting** - Google infrastructure
- **AWS S3 + CloudFront** - Scalable CDN
- **Any web server** - Apache, Nginx, etc.

### Deployment Steps
1. Push code to GitHub repository
2. Connect to hosting provider
3. Configure build settings:
   - Build command: (none)
   - Publish directory: `.` or `/`
4. Deploy
5. Configure custom domain (optional)

### Environment Variables
None required - completely static application.

### HTTPS
Recommended for PWA installation and Service Worker:
- Most modern hosts provide automatic HTTPS
- Required for Service Worker functionality
- Enhances security and SEO

## Security Considerations

### Privacy
- No user data collected (except GA4 analytics)
- No accounts or authentication
- Settings stored locally only (localStorage)
- No third-party scripts (except GA4)
- No cookies set

### Content Security Policy (Future)
Could add CSP headers for enhanced security:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
```

## Accessibility Compliance

### WCAG 2.1 AA
- **Perceivable:** Text contrast ratios meet AA standards
- **Operable:** Full keyboard navigation
- **Understandable:** Clear labels and instructions
- **Robust:** Semantic HTML, ARIA labels

### Keyboard Navigation
- Tab through all interactive elements
- Space/Enter to activate buttons
- Arrow keys for sliders
- Escape to close modals (if applicable)
- All shortcuts documented in help panel

### Screen Reader Support
- ARIA labels on all controls
- Live regions for dynamic updates (brightness value)
- Proper heading hierarchy
- Descriptive button text

## Future Enhancements

### Near Term
- Color picker for custom background colors
- Multi-screen support (detect multiple monitors)
- Gradient options (top-to-bottom, side-to-side)
- Animated transitions (pulse, fade, etc.)

### Long Term
- Saved profiles/scenes
- Integration with video conferencing apps
- Camera alignment guides
- Advanced color temperature with Kelvin scale
- Brightness scheduling (time-based presets)
- Mobile app version (native iOS/Android)

## Browser Extension Version
Could create browser extensions for:
- Chrome/Edge (Chromium)
- Firefox
- Safari
Benefits: Easier access, no separate window needed

## Known Limitations

### Hardware Limitations
- Light output depends on monitor brightness
- Not as powerful as dedicated lighting equipment
- Color accuracy varies by monitor

### Software Limitations
- Cannot control external monitor brightness directly
- Requires second monitor or device
- Fullscreen API behavior varies by browser
- Service Worker requires HTTPS in production

## Troubleshooting

### Settings Not Saving
- Check browser localStorage support
- Check for private/incognito mode
- Verify cookies/storage not blocked

### Fullscreen Not Working
- Some browsers restrict fullscreen to user gestures
- Try keyboard shortcut (F) instead of button
- Check browser permissions

### Keyboard Shortcuts Not Working
- Ensure page has focus (click on page)
- Check for browser extension conflicts
- Verify not in input field

### PWA Not Installing
- Requires HTTPS (except localhost)
- Service Worker must register successfully
- Manifest must be valid
- Browser must support PWA installation

## Contributing

See `CONTRIBUTING.md` for detailed guidelines:
- Code standards (HTML, CSS, JS)
- Testing requirements
- Pull request process
- Areas for contribution

## License

MIT License - Free to use, modify, and distribute.

## Credits

- **Design & Development:** Bill Anastas (@banastas)
- **Inspiration:** Need for better video call lighting
- **Made with ❤️** in California

## Support & Contact

- **Website:** https://bright.supply
- **Email:** info@bright.supply
- **Twitter:** @banastas
- **GitHub:** https://github.com/banastas/bright.supply
- **Issues:** https://github.com/banastas/bright.supply/issues
- **Main Site:** https://banast.as

---

**Last Updated:** December 2024
**Version:** 2.0.0
**Live Site:** https://bright.supply
**Project Type:** Progressive Web App (Vanilla JS)
**Dependencies:** None (Zero dependencies!)
