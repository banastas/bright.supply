# Analytics implementation

bright.supply uses Google Analytics 4 through the Google tag and measurement ID `G-DP3EWLQT9L`. The implementation is centralized in `analytics.js`, so all 270 generated pages share one configuration and event contract.

## Runtime behavior

- The Google tag loads only on `bright.supply` and `www.bright.supply`.
- Localhost, direct file previews, and third-party preview hosts do not load Google or queue measurement events.
- Each document sends the standard GA4 `page_view` through the `config` call.
- `page_location` and `page_referrer` are reduced to origin and path. Query strings and fragments are not sent.
- Google Signals and ad-personalization signals are disabled.
- The first-party analytics cookie lifetime is limited to 90 days and refreshed on activity.
- The application sends completed control interactions, not continuous slider input events. Repeated keyboard brightness changes are debounced into one event.

The site does not display an analytics consent prompt. This is an explicit product decision, not a claim that a consent prompt is unnecessary in every jurisdiction.

## Event contract

GA4 automatically collects `page_view`, `session_start`, `first_visit`, and `user_engagement` when the tag is active. Enhanced Measurement settings in the GA4 data stream may add supported events such as outbound clicks.

bright.supply adds these product events:

| Event | Trigger | Parameters beyond shared context |
|---|---|---|
| `color_select` | A color swatch is selected | `selected_color`, `destination_path`, `interaction_method` |
| `language_select` | A different language is selected | `selected_language`, `destination_path`, `interaction_method` |
| `brightness_change` | A slider, preset, keyboard adjustment, or `?preset=` launch commits a brightness value | `brightness_percent`, `interaction_method`, optional `preset` |
| `temperature_change` | The white-balance slider commits a value | `temperature_percent`, `interaction_method` |
| `brightness_toggle` | Space toggles the current and previous brightness | `brightness_percent`, `interaction_method` |
| `settings_reset` | Reset restores brightness and white balance | `brightness_percent`, `temperature_percent`, `interaction_method` |
| `fullscreen_enter` | The browser confirms entry into fullscreen | `brightness_percent`, `interaction_method` |
| `fullscreen_exit` | The browser confirms exit from fullscreen | `brightness_percent`, `interaction_method` |
| `fullscreen_error` | A fullscreen request is unavailable or rejected | `error_reason`, `interaction_method` |
| `help_toggle` | Keyboard help opens or closes | `state`, `interaction_method` |
| `pwa_install` | The browser reports a completed PWA installation | shared context only |
| `pwa_launch` | The site starts in standalone display mode | shared context only |

Every custom event also includes:

- `page_kind`: `home` or `color`
- `screen_color`: the stable English color slug
- `content_language`: the document language code
- `display_mode`: `browser`, `standalone`, or `fullscreen`

Event names and parameter names are validated before dispatch. Values are limited to strings, finite numbers, and booleans. Strings are trimmed to 100 characters, invalid parameters are dropped, and no event can contain more than 25 parameters.

## GA4 property setup

Event parameters appear in Realtime and DebugView without custom definitions. Register the parameters below in **Admin > Data display > Custom definitions** before relying on them in standard reports or Explorations.

Recommended event-scoped custom dimensions:

- `page_kind`
- `screen_color`
- `content_language`
- `display_mode`
- `interaction_method`
- `selected_color`
- `selected_language`
- `destination_path`
- `preset`
- `state`
- `error_reason`

Recommended custom metrics:

- `brightness_percent`, integer, standard unit
- `temperature_percent`, integer, standard unit

Useful key events are `fullscreen_enter` and `pwa_install`. Mark them as key events only if those actions represent the outcomes the property is intended to optimize.

Enhanced Measurement is configured in the GA4 property rather than this repository. Keep page views enabled. Outbound click measurement is safe to enable, although the current utility has very few external links. Site search, form interactions, video engagement, and file downloads do not match the present interface.

## Verification

Run the complete local contract:

```bash
npm test
```

This command regenerates every page, validates analytics coverage and load order, checks the application event inventory, and runs the analytics runtime in isolated production and non-production browser environments.

After deployment:

1. Open `https://bright.supply/?analytics_debug=1` in a browser without a tracking blocker.
2. Select a color, change brightness, open help, and enter fullscreen.
3. Confirm `page_view` and the matching product events in GA4 DebugView.
4. Confirm normal traffic in Realtime.
5. Remove `analytics_debug=1` for ordinary use. The query string is never included in `page_location`.

Standard GA4 reports can take longer to populate than Realtime and DebugView. Repository and network checks prove that the site sent correctly formed requests, but they do not prove that the GA4 property retained or reported them.
