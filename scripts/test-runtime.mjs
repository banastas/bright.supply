import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const analyticsSource = readFileSync('analytics.js', 'utf8');
const appSource = readFileSync('app.js', 'utf8');

const createRuntime = ({
    hostname = 'bright.supply',
    href = `https://${hostname}/blue/?preset=max&email=private@example.com`,
    referrer = 'https://example.com/source/?person=private',
    standalone = false
} = {}) => {
    const scripts = [];
    const listeners = new Map();
    const document = {
        title: 'Blue Screen Online | bright.supply',
        referrer,
        body: { dataset: { pageKind: 'color', colorSlug: 'blue' } },
        documentElement: { lang: 'en' },
        fullscreenElement: null,
        webkitFullscreenElement: null,
        head: {
            appendChild(element) {
                scripts.push(element);
            }
        },
        createElement(tagName) {
            return { tagName: tagName.toUpperCase(), async: false, id: '', src: '' };
        },
        getElementById(id) {
            return scripts.find((script) => script.id === id) || null;
        }
    };
    const location = {
        hostname,
        href,
        origin: `https://${hostname}`,
        search: new URL(href).search
    };
    const window = {
        location,
        navigator: { standalone },
        matchMedia: () => ({ matches: standalone }),
        addEventListener(type, callback) {
            listeners.set(type, callback);
        }
    };
    const context = vm.createContext({
        URL,
        URLSearchParams,
        console,
        document,
        encodeURIComponent,
        window
    });
    vm.runInContext(analyticsSource, context, { filename: 'analytics.js' });
    const calls = () => window.dataLayer.map((entry) => Array.from(entry));
    return { calls, listeners, scripts, window };
};

{
    const runtime = createRuntime({ hostname: 'localhost', href: 'http://localhost:8000/blue/' });
    assert.equal(runtime.window.brightSupplyAnalytics.enabled, false, 'analytics is disabled outside production');
    assert.equal(runtime.scripts.length, 0, 'the Google tag is not loaded outside production');
    assert.equal(runtime.calls().length, 0, 'no measurement calls are queued outside production');
    assert.equal(runtime.window.brightSupplyAnalytics.track('brightness_change'), false, 'local events are ignored');
}

{
    const runtime = createRuntime();
    const initialCalls = runtime.calls();
    assert.equal(runtime.window.brightSupplyAnalytics.enabled, true, 'analytics is enabled on production');
    assert.equal(runtime.scripts.length, 1, 'one Google tag is loaded');
    assert.equal(runtime.scripts[0].id, 'bright-supply-google-tag');
    assert.equal(runtime.scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-DP3EWLQT9L');
    assert.equal(initialCalls[0][0], 'js', 'gtag initialization is queued first');
    assert.equal(initialCalls[1][0], 'config', 'GA4 configuration is queued');
    assert.equal(initialCalls[1][1], 'G-DP3EWLQT9L');

    const config = initialCalls[1][2];
    assert.equal(config.send_page_view, true);
    assert.equal(config.allow_google_signals, false);
    assert.equal(config.allow_ad_personalization_signals, false);
    assert.equal(config.cookie_expires, 7776000);
    assert.equal(config.page_location, 'https://bright.supply/blue/', 'page query data is not sent');
    assert.equal(config.page_referrer, 'https://example.com/source/', 'referrer query data is not sent');
    assert.equal(config.page_kind, 'color');
    assert.equal(config.screen_color, 'blue');
    assert.equal(config.content_language, 'en');
    assert.equal(config.display_mode, 'browser');
    assert.equal(config.debug_mode, false);

    assert.equal(runtime.window.brightSupplyAnalytics.track('brightness_change', {
        brightness_percent: 75,
        interaction_method: ' slider ',
        nested_value: { private: true },
        very_long_value: 'x'.repeat(150)
    }), true);
    const eventCall = runtime.calls().at(-1);
    assert.equal(eventCall[0], 'event');
    assert.equal(eventCall[1], 'brightness_change');
    assert.deepEqual(JSON.parse(JSON.stringify(eventCall[2])), {
        page_kind: 'color',
        screen_color: 'blue',
        content_language: 'en',
        display_mode: 'browser',
        brightness_percent: 75,
        interaction_method: 'slider',
        very_long_value: 'x'.repeat(100)
    });

    const callCount = runtime.calls().length;
    assert.equal(runtime.window.brightSupplyAnalytics.track('Invalid Event Name'), false);
    assert.equal(runtime.calls().length, callCount, 'invalid event names are ignored');

    runtime.listeners.get('appinstalled')();
    assert.equal(runtime.calls().at(-1)[1], 'pwa_install', 'PWA installation is measured');
}

{
    const runtime = createRuntime({
        href: 'https://bright.supply/?analytics_debug=1&private=value',
        standalone: true
    });
    const calls = runtime.calls();
    assert.equal(calls[1][2].debug_mode, true, 'the explicit production debug flag enables DebugView');
    assert.equal(calls[1][2].page_location, 'https://bright.supply/', 'debug and arbitrary query data are excluded from page_location');
    assert.equal(calls[2][1], 'pwa_launch', 'standalone launches are measured');
}

const expectedEvents = [
    'brightness_change',
    'brightness_toggle',
    'color_select',
    'fullscreen_enter',
    'fullscreen_error',
    'fullscreen_exit',
    'help_toggle',
    'language_select',
    'settings_reset',
    'temperature_change'
];
for (const eventName of expectedEvents) {
    assert.match(appSource, new RegExp(`['"]${eventName}['"]`), `${eventName} is instrumented in app.js`);
}
assert.doesNotMatch(appSource, /\bgtag\s*\(/, 'application code uses the shared analytics adapter');

class FakeElement {
    constructor(id = '') {
        this.id = id;
        this.value = '';
        this.textContent = '';
        this.hidden = false;
        this.href = '';
        this.dataset = {};
        this.attributes = new Map();
        this.listeners = new Map();
        this.children = [];
        this.classes = new Set();
        this.classList = {
            add: (...names) => names.forEach((name) => this.classes.add(name)),
            remove: (...names) => names.forEach((name) => this.classes.delete(name)),
            toggle: (name, force) => {
                const enabled = force === undefined ? !this.classes.has(name) : Boolean(force);
                if (enabled) this.classes.add(name);
                else this.classes.delete(name);
                return enabled;
            }
        };
        this.style = {
            setProperty: (name, value) => this.attributes.set(`style:${name}`, value)
        };
    }

    addEventListener(type, callback) {
        const callbacks = this.listeners.get(type) || [];
        callbacks.push(callback);
        this.listeners.set(type, callbacks);
    }

    dispatch(type, event = {}) {
        for (const callback of this.listeners.get(type) || []) callback({ target: this, ...event });
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.get(name) ?? null;
    }

    appendChild(element) {
        this.children.push(element);
        return element;
    }

    closest() {
        return null;
    }

    focus() {}
    remove() {}
}

const createApplicationRuntime = () => {
    const events = [];
    const assignedLocations = [];
    const documentListeners = new Map();
    const windowListeners = new Map();
    const elements = new Map();
    const addElement = (id, value = '') => {
        const element = new FakeElement(id);
        element.value = value;
        elements.set(id, element);
        return element;
    };

    const body = new FakeElement('body');
    body.dataset = {
        pageKind: 'color',
        colorSlug: 'blue',
        colorValue: '#0a84ff',
        supportsBrightness: 'true',
        supportsTemperature: 'false'
    };
    addElement('brightness', '750');
    addElement('brightness-value');
    addElement('temperature', '50');
    const temperatureContainer = addElement('temperature-container');
    addElement('instructions');
    addElement('help-toggle');
    const languageSelect = addElement('language-select', '/es/blue/');
    languageSelect.selectedOptions = [{ lang: 'es' }];
    addElement('reset-btn');
    addElement('fullscreen-btn');
    for (const preset of ['low', 'medium', 'high', 'max']) addElement(`preset-${preset}`);
    const translations = addElement('app-translations');
    translations.textContent = '{}';

    const colorLink = new FakeElement('blue-link');
    colorLink.dataset.colorSlug = 'green';
    colorLink.href = 'https://bright.supply/green/';

    const documentElement = new FakeElement('html');
    documentElement.requestFullscreen = () => Promise.resolve();
    const document = {
        body,
        documentElement,
        fullscreenElement: null,
        webkitFullscreenElement: null,
        hidden: false,
        getElementById(id) {
            return elements.get(id) || null;
        },
        querySelector(selector) {
            return selector === '.temperature-container' ? temperatureContainer : null;
        },
        querySelectorAll(selector) {
            if (selector === '.color-swatch') return [colorLink];
            if (selector === 'button') return [...elements.values()].filter((element) => element.id.includes('btn') || element.id.startsWith('preset-') || element.id === 'help-toggle');
            return [];
        },
        addEventListener(type, callback) {
            const callbacks = documentListeners.get(type) || [];
            callbacks.push(callback);
            documentListeners.set(type, callbacks);
        },
        createElement() {
            return new FakeElement();
        }
    };
    body.appendChild = (element) => {
        if (element.id) elements.set(element.id, element);
        return element;
    };

    const location = {
        origin: 'https://bright.supply',
        search: '',
        assign(value) {
            assignedLocations.push(value);
        }
    };
    const window = {
        location,
        brightSupplyAnalytics: {
            track(name, parameters) {
                events.push({ name, parameters });
                return true;
            }
        },
        addEventListener(type, callback) {
            const callbacks = windowListeners.get(type) || [];
            callbacks.push(callback);
            windowListeners.set(type, callbacks);
        }
    };
    const localStorage = new Map();
    const context = vm.createContext({
        Element: FakeElement,
        URL,
        URLSearchParams,
        clearTimeout() {},
        console,
        document,
        localStorage: {
            getItem: (key) => localStorage.get(key) || null,
            setItem: (key, value) => localStorage.set(key, value)
        },
        navigator: { vibrate() {} },
        setTimeout(callback) {
            callback();
            return 1;
        },
        window
    });
    vm.runInContext(appSource, context, { filename: 'app.js' });
    for (const callback of documentListeners.get('DOMContentLoaded') || []) callback();

    return { app: window.brightSupply, assignedLocations, colorLink, document, documentElement, events, languageSelect };
};

{
    const runtime = createApplicationRuntime();
    runtime.app.setPreset('max', { feedback: false, interactionMethod: 'button' });
    runtime.app.temperatureSlider.value = '20';
    runtime.app.renderTemperature();
    runtime.app.handleTemperatureChange('slider');
    runtime.app.toggleBrightness('keyboard');
    runtime.app.resetBrightness('button');
    runtime.app.toggleInstructions('button');
    runtime.colorLink.dispatch('click');
    runtime.app.changeLanguage();

    runtime.app.pendingFullscreenMethod = 'button';
    runtime.document.fullscreenElement = runtime.documentElement;
    runtime.app.handleFullscreenChange();
    runtime.document.fullscreenElement = null;
    runtime.app.handleFullscreenChange();
    delete runtime.documentElement.requestFullscreen;
    runtime.app.toggleFullscreen('keyboard');

    const emittedEvents = runtime.events.map(({ name }) => name);
    for (const eventName of expectedEvents) {
        assert.ok(emittedEvents.includes(eventName), `${eventName} fires from an application interaction`);
    }
    assert.equal(runtime.assignedLocations[0], 'https://bright.supply/es/blue/');
    assert.equal(runtime.events.find(({ name }) => name === 'color_select').parameters.selected_color, 'green');
    assert.equal(runtime.events.find(({ name }) => name === 'language_select').parameters.selected_language, 'es');
    assert.equal(runtime.events.find(({ name }) => name === 'fullscreen_enter').parameters.interaction_method, 'button');
    assert.equal(runtime.events.find(({ name }) => name === 'fullscreen_exit').parameters.interaction_method, 'browser');
}

process.stdout.write('Application and analytics runtime tests passed.\n');
