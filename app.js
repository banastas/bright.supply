/**
 * bright.supply application controller.
 * The route selects the screen color; controls update brightness and white balance.
 */

class BrightSupply {
    constructor() {
        this.body = document.body;
        this.brightnessSlider = document.getElementById('brightness');
        this.brightnessValue = document.getElementById('brightness-value');
        this.temperatureSlider = document.getElementById('temperature');
        this.temperatureContainer = document.querySelector('.temperature-container');
        this.instructions = document.getElementById('instructions');
        this.helpToggle = document.getElementById('help-toggle');
        this.languageSelect = document.getElementById('language-select');
        this.resetBtn = document.getElementById('reset-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.presetButtons = {
            low: document.getElementById('preset-low'),
            medium: document.getElementById('preset-medium'),
            high: document.getElementById('preset-high'),
            max: document.getElementById('preset-max')
        };
        this.defaultBrightness = 750;
        this.defaultTemperature = 50;
        this.currentBrightness = this.defaultBrightness;
        this.previousBrightness = 0;
        this.currentTemperature = this.defaultTemperature;
        this.baseColor = this.parseHexColor(this.body.dataset.colorValue || '#ffffff');
        this.supportsBrightness = this.body.dataset.supportsBrightness !== 'false';
        this.supportsTemperature = this.body.dataset.supportsTemperature === 'true';
        this.isFullscreen = false;
        this.isHelpVisible = false;
        this.brightnessInteractionStart = null;
        this.brightnessEventTimer = null;
        this.pendingFullscreenMethod = 'browser';
        this.presets = { low: 200, medium: 500, high: 750, max: 1000 };
        this.messages = this.loadTranslations();
        this.init();
    }

    loadTranslations() {
        try {
            const element = document.getElementById('app-translations');
            return element ? JSON.parse(element.textContent) : {};
        } catch (error) {
            console.warn('Could not load translations:', error);
            return {};
        }
    }

    message(key, fallback) {
        return this.messages[key] || fallback;
    }

    init() {
        this.loadSettings();
        this.applyLaunchPreset();
        this.setupEventListeners();
        this.temperatureContainer.hidden = !this.supportsTemperature;
        this.renderTemperature();
        this.renderBrightness();
    }

    setupEventListeners() {
        this.brightnessSlider.addEventListener('input', () => this.handleBrightnessInput());
        this.brightnessSlider.addEventListener('change', () => this.handleBrightnessChange('slider'));
        this.temperatureSlider.addEventListener('input', () => this.renderTemperature());
        this.temperatureSlider.addEventListener('change', () => this.handleTemperatureChange('slider'));
        this.helpToggle.addEventListener('click', () => this.toggleInstructions('button'));
        for (const preset of Object.keys(this.presetButtons)) {
            this.presetButtons[preset].addEventListener('click', () => this.setPreset(preset, { interactionMethod: 'button' }));
        }
        this.resetBtn.addEventListener('click', () => this.resetBrightness('button'));
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen('button'));
        this.languageSelect.addEventListener('change', () => this.changeLanguage());
        document.querySelectorAll('.color-swatch').forEach((link) => {
            link.addEventListener('click', () => this.trackEvent('color_select', {
                selected_color: link.dataset.colorSlug,
                destination_path: new URL(link.href, window.location.origin).pathname,
                interaction_method: 'swatch'
            }));
        });
        document.addEventListener('keydown', (event) => this.handleKeydown(event));
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        this.setupTouchEvents();
    }

    clampNumber(value, fallback, min, max) {
        const number = Number(value);
        if (!Number.isFinite(number)) return fallback;
        return Math.min(max, Math.max(min, Math.round(number)));
    }

    parseHexColor(value) {
        const match = /^#([0-9a-f]{6})$/i.exec(value);
        if (!match) return { r: 255, g: 255, b: 255 };
        return {
            r: Number.parseInt(match[1].slice(0, 2), 16),
            g: Number.parseInt(match[1].slice(2, 4), 16),
            b: Number.parseInt(match[1].slice(4, 6), 16)
        };
    }

    handleBrightnessInput() {
        if (this.brightnessInteractionStart === null) {
            this.brightnessInteractionStart = this.currentBrightness;
        }
        this.setBrightness(this.brightnessSlider.value, { previousValue: this.brightnessInteractionStart });
    }

    handleBrightnessChange(interactionMethod) {
        this.brightnessInteractionStart = null;
        this.saveSettings();
        this.trackBrightnessChange(interactionMethod);
    }

    handleTemperatureChange(interactionMethod) {
        this.saveSettings();
        this.trackEvent('temperature_change', {
            temperature_percent: this.currentTemperature,
            interaction_method: interactionMethod
        });
    }

    setBrightness(value, options = {}) {
        const nextBrightness = this.clampNumber(value, this.defaultBrightness, 0, 1000);
        const previousValue = this.clampNumber(options.previousValue, this.currentBrightness, 0, 1000);
        if (nextBrightness !== this.currentBrightness) {
            if (options.trackPrevious) this.previousBrightness = this.currentBrightness;
            else if (options.previousValue !== undefined && previousValue !== nextBrightness) {
                this.previousBrightness = previousValue;
            }
        }
        this.currentBrightness = nextBrightness;
        this.brightnessSlider.value = String(nextBrightness);
        this.renderBrightness();
    }

    updateBrightness() {
        this.setBrightness(this.brightnessSlider.value);
    }

    renderBrightness() {
        const percentage = Math.round((this.currentBrightness / 1000) * 100);
        const renderedColor = this.applyBackground();
        this.brightnessValue.textContent = `${percentage}%`;
        this.brightnessSlider.setAttribute('aria-valuenow', this.currentBrightness);
        this.brightnessSlider.setAttribute('aria-valuetext', `${percentage}%`);
        this.updateSliderFill();
        this.updatePresetButtons();
        this.updateAdaptiveColors(renderedColor);
    }

    renderTemperature() {
        this.currentTemperature = this.clampNumber(this.temperatureSlider.value, this.defaultTemperature, 0, 100);
        this.temperatureSlider.value = String(this.currentTemperature);
        this.temperatureSlider.setAttribute('aria-valuenow', this.currentTemperature);
        this.temperatureSlider.setAttribute('aria-valuetext', `${this.currentTemperature}%`);
        if (this.brightnessSlider) this.renderBrightness();
    }

    updateTemperature() {
        this.renderTemperature();
    }

    applyBackground() {
        const source = this.supportsTemperature ? this.getTemperatureColor() : this.baseColor;
        const factor = this.currentBrightness / 1000;
        const rendered = {
            r: Math.round(source.r * factor),
            g: Math.round(source.g * factor),
            b: Math.round(source.b * factor)
        };
        this.body.style.backgroundColor = `rgb(${rendered.r}, ${rendered.g}, ${rendered.b})`;
        return rendered;
    }

    getTemperatureColor() {
        const temp = this.currentTemperature;
        if (temp <= 50) {
            const ratio = temp / 50;
            return { r: Math.round(200 + (55 * ratio)), g: Math.round(220 + (35 * ratio)), b: 255 };
        }
        const ratio = (temp - 50) / 50;
        return { r: 255, g: Math.round(255 - (60 * ratio)), b: Math.round(255 - (155 * ratio)) };
    }

    relativeLuminance(color) {
        const channels = [color.r, color.g, color.b].map((value) => {
            const channel = value / 255;
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
    }

    updateAdaptiveColors(renderedColor) {
        this.body.classList.toggle('use-dark-text', this.relativeLuminance(renderedColor) > 0.36);
    }

    updateSliderFill() {
        this.brightnessSlider.style.setProperty('--slider-fill-percent', `${(this.currentBrightness / 10)}%`);
    }

    setPreset(preset, options = {}) {
        if (!Object.prototype.hasOwnProperty.call(this.presets, preset)) return;
        this.setBrightness(this.presets[preset], { trackPrevious: options.trackPrevious !== false });
        if (options.save !== false) this.saveSettings();
        if (options.feedback !== false) {
            const presetName = this.messages.presetNames?.[preset] || preset;
            const template = this.message('setBrightness', 'Set to {preset} brightness');
            this.showFeedback(template.replace('{preset}', presetName));
        }
        if (options.analytics !== false) {
            this.trackBrightnessChange(options.interactionMethod || 'preset', { preset });
        }
    }

    updatePresetButtons() {
        for (const [preset, value] of Object.entries(this.presets)) {
            const button = this.presetButtons[preset];
            const isActive = Math.abs(this.currentBrightness - value) < 50;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        }
    }

    resetBrightness(interactionMethod = 'button') {
        this.setBrightness(this.defaultBrightness, { trackPrevious: true });
        this.temperatureSlider.value = String(this.defaultTemperature);
        this.renderTemperature();
        this.saveSettings();
        this.showFeedback(this.message('resetFeedback', 'Reset to defaults'));
        this.trackEvent('settings_reset', {
            brightness_percent: this.brightnessPercent(),
            temperature_percent: this.currentTemperature,
            interaction_method: interactionMethod
        });
    }

    toggleFullscreen(interactionMethod = 'button') {
        this.pendingFullscreenMethod = interactionMethod;
        if (this.isFullscreen) this.exitFullscreen();
        else this.enterFullscreen();
    }

    enterFullscreen() {
        const element = document.documentElement;
        const requestFullscreen = element.requestFullscreen || element.webkitRequestFullscreen;
        if (!requestFullscreen) {
            this.showFeedback(this.message('fullscreenUnavailable', 'Fullscreen unavailable'));
            this.trackEvent('fullscreen_error', {
                interaction_method: this.pendingFullscreenMethod,
                error_reason: 'unsupported'
            });
            this.pendingFullscreenMethod = 'browser';
            return;
        }
        const request = requestFullscreen.call(element);
        this.handleFullscreenRequest(request, 'enter fullscreen');
    }

    exitFullscreen() {
        const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
        if (!exitFullscreen) {
            this.showFeedback(this.message('fullscreenUnavailable', 'Fullscreen unavailable'));
            this.trackEvent('fullscreen_error', {
                interaction_method: this.pendingFullscreenMethod,
                error_reason: 'unsupported'
            });
            this.pendingFullscreenMethod = 'browser';
            return;
        }
        const request = exitFullscreen.call(document);
        this.handleFullscreenRequest(request, 'exit fullscreen');
    }

    handleFullscreenRequest(request, action) {
        if (request && typeof request.catch === 'function') {
            request.catch((error) => {
                console.warn(`Could not ${action}:`, error);
                this.showFeedback(this.message('fullscreenUnavailable', 'Fullscreen unavailable'));
                this.trackEvent('fullscreen_error', {
                    interaction_method: this.pendingFullscreenMethod,
                    error_reason: error?.name || 'request_rejected'
                });
                this.pendingFullscreenMethod = 'browser';
            });
        }
    }

    handleFullscreenChange() {
        const wasFullscreen = this.isFullscreen;
        this.isFullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
        this.fullscreenBtn.textContent = this.isFullscreen ? this.message('exit', 'Exit') : this.message('fullscreen', 'Fullscreen');
        this.fullscreenBtn.setAttribute('aria-label', this.isFullscreen
            ? this.message('exitFullscreen', 'Exit fullscreen mode')
            : this.message('enterFullscreen', 'Enter fullscreen mode'));
        if (wasFullscreen !== this.isFullscreen) {
            this.trackEvent(this.isFullscreen ? 'fullscreen_enter' : 'fullscreen_exit', {
                interaction_method: this.pendingFullscreenMethod,
                brightness_percent: this.brightnessPercent()
            });
            this.pendingFullscreenMethod = 'browser';
        }
    }

    changeLanguage() {
        const target = new URL(this.languageSelect.value, window.location.origin);
        if (target.origin === window.location.origin) {
            const option = this.languageSelect.selectedOptions[0];
            this.trackEvent('language_select', {
                selected_language: option?.lang || 'unknown',
                destination_path: target.pathname,
                interaction_method: 'select'
            });
            window.location.assign(target.href);
        }
    }

    handleKeydown(event) {
        if (this.shouldIgnoreShortcut(event)) return;
        const brightnessShortcuts = ['ArrowLeft', 'ArrowRight', 'Space', 'KeyR', 'Digit1', 'Digit2', 'Digit3', 'Digit4'];
        const shortcuts = this.supportsBrightness
            ? [...brightnessShortcuts, 'KeyF', 'KeyH']
            : ['KeyF', 'KeyH'];
        if (shortcuts.includes(event.code)) event.preventDefault();
        const actions = {
            ArrowLeft: () => this.adjustBrightness(-50), ArrowRight: () => this.adjustBrightness(50),
            Space: () => this.toggleBrightness('keyboard'), KeyR: () => this.resetBrightness('keyboard'),
            KeyF: () => this.toggleFullscreen('keyboard'), KeyH: () => this.toggleInstructions('keyboard'),
            Digit1: () => this.setPreset('low', { interactionMethod: 'keyboard' }),
            Digit2: () => this.setPreset('medium', { interactionMethod: 'keyboard' }),
            Digit3: () => this.setPreset('high', { interactionMethod: 'keyboard' }),
            Digit4: () => this.setPreset('max', { interactionMethod: 'keyboard' })
        };
        actions[event.code]?.();
    }

    shouldIgnoreShortcut(event) {
        const target = event.target;
        return target instanceof Element && Boolean(target.closest('input, textarea, select, button, [contenteditable="true"]'));
    }

    adjustBrightness(delta) {
        this.setBrightness(this.currentBrightness + delta, { trackPrevious: true });
        this.saveSettings();
        this.scheduleBrightnessEvent('keyboard');
    }

    toggleBrightness(interactionMethod = 'keyboard') {
        const current = this.currentBrightness;
        this.currentBrightness = this.clampNumber(this.previousBrightness, this.defaultBrightness, 0, 1000);
        this.previousBrightness = current;
        this.brightnessSlider.value = String(this.currentBrightness);
        this.renderBrightness();
        this.saveSettings();
        this.showFeedback(this.message('toggleFeedback', 'Toggled brightness'));
        this.trackEvent('brightness_toggle', {
            brightness_percent: this.brightnessPercent(),
            interaction_method: interactionMethod
        });
    }

    toggleInstructions(interactionMethod = 'button') {
        this.isHelpVisible = !this.isHelpVisible;
        this.instructions.classList.toggle('visible', this.isHelpVisible);
        this.instructions.setAttribute('aria-hidden', String(!this.isHelpVisible));
        this.helpToggle.classList.toggle('active', this.isHelpVisible);
        this.helpToggle.setAttribute('aria-expanded', String(this.isHelpVisible));
        this.helpToggle.setAttribute('aria-label', this.isHelpVisible
            ? this.message('hideHelp', 'Hide keyboard shortcuts')
            : this.message('showHelp', 'Show keyboard shortcuts'));
        this.trackEvent('help_toggle', {
            state: this.isHelpVisible ? 'open' : 'closed',
            interaction_method: interactionMethod
        });
    }

    showFeedback(message) {
        if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
        if (this.feedbackRemoveTimer) clearTimeout(this.feedbackRemoveTimer);
        let feedback = document.getElementById('feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'feedback';
            feedback.setAttribute('role', 'status');
            document.body.appendChild(feedback);
        }
        feedback.textContent = message;
        feedback.classList.add('visible');
        this.feedbackTimer = setTimeout(() => {
            feedback.classList.remove('visible');
            this.feedbackRemoveTimer = setTimeout(() => feedback.remove(), 300);
        }, 1600);
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('brightSupplySettings');
            if (!saved) return;
            const settings = JSON.parse(saved);
            if (!settings || typeof settings !== 'object') return;
            this.currentBrightness = this.clampNumber(settings.brightness, this.defaultBrightness, 0, 1000);
            this.currentTemperature = this.clampNumber(settings.temperature, this.defaultTemperature, 0, 100);
            this.brightnessSlider.value = String(this.currentBrightness);
            this.temperatureSlider.value = String(this.currentTemperature);
        } catch (error) {
            console.warn('Could not load settings:', error);
        }
    }

    applyLaunchPreset() {
        if (!this.supportsBrightness) return;
        const preset = new URLSearchParams(window.location.search).get('preset');
        if (preset && Object.prototype.hasOwnProperty.call(this.presets, preset)) {
            this.setPreset(preset, { analytics: false, feedback: false, save: true, trackPrevious: true });
            this.trackBrightnessChange('launch_preset', { preset });
        }
    }

    brightnessPercent() {
        return Math.round(this.currentBrightness / 10);
    }

    trackBrightnessChange(interactionMethod, parameters = {}) {
        this.trackEvent('brightness_change', {
            brightness_percent: this.brightnessPercent(),
            interaction_method: interactionMethod,
            ...parameters
        });
    }

    scheduleBrightnessEvent(interactionMethod) {
        if (this.brightnessEventTimer) clearTimeout(this.brightnessEventTimer);
        this.brightnessEventTimer = setTimeout(() => {
            this.brightnessEventTimer = null;
            this.trackBrightnessChange(interactionMethod);
        }, 500);
    }

    trackEvent(name, parameters = {}) {
        return window.brightSupplyAnalytics?.track(name, parameters) || false;
    }

    saveSettings() {
        try {
            localStorage.setItem('brightSupplySettings', JSON.stringify({
                brightness: this.currentBrightness,
                temperature: this.currentTemperature
            }));
        } catch (error) {
            console.warn('Could not save settings:', error);
        }
    }

    handleVisibilityChange() {
        if (document.hidden) this.saveSettings();
    }

    setupTouchEvents() {
        document.querySelectorAll('button').forEach((button) => {
            button.addEventListener('pointerdown', () => navigator.vibrate?.(10));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.brightSupply = new BrightSupply();
});

window.addEventListener('beforeunload', () => window.brightSupply?.saveSettings());
