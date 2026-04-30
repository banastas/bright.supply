/**
 * bright.supply - Main Application Script
 * Enhanced with keyboard shortcuts, presets, and persistence
 */

class BrightSupply {
    constructor() {
        this.brightnessSlider = document.getElementById('brightness');
        this.brightnessValue = document.getElementById('brightness-value');
        this.instructions = document.getElementById('instructions');
        this.helpToggle = document.getElementById('help-toggle');
        this.branding = document.getElementById('branding');

        // Temperature slider
        this.temperatureSlider = document.getElementById('temperature');

        // Preset buttons
        this.presetButtons = {
            low: document.getElementById('preset-low'),
            medium: document.getElementById('preset-medium'),
            high: document.getElementById('preset-high'),
            max: document.getElementById('preset-max')
        };

        // Control buttons
        this.resetBtn = document.getElementById('reset-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');

        // State
        this.defaultBrightness = 750;
        this.defaultTemperature = 50;
        this.currentBrightness = this.defaultBrightness;
        this.previousBrightness = 0;
        this.currentTemperature = this.defaultTemperature;
        this.isFullscreen = false;
        this.isHelpVisible = false;
        this.brightnessInteractionStart = null;

        // Preset values
        this.presets = {
            low: 200,
            medium: 500,
            high: 750,
            max: 1000
        };

        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applyLaunchPreset();
        this.setupEventListeners();
        this.renderBrightness();
        this.renderTemperature();
        this.updatePresetButtons();
        this.updateSliderFill();
        // Apply initial text colors
        const percentage = Math.round((this.currentBrightness / 1000) * 100);
        this.updateTextColors(percentage);
    }
    
    setupEventListeners() {
        // Brightness slider
        this.brightnessSlider.addEventListener('input', () => this.handleBrightnessInput());
        this.brightnessSlider.addEventListener('change', () => this.handleBrightnessChange());

        // Temperature slider
        this.temperatureSlider.addEventListener('input', () => this.renderTemperature());
        this.temperatureSlider.addEventListener('change', () => this.saveSettings());

        // Help toggle button
        this.helpToggle.addEventListener('click', () => this.toggleInstructions());

        // Preset buttons
        Object.keys(this.presetButtons).forEach(preset => {
            this.presetButtons[preset].addEventListener('click', () => this.setPreset(preset));
        });

        // Control buttons
        this.resetBtn.addEventListener('click', () => this.resetBrightness());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
        
        // Visibility change (for persistence)
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
        
        // Touch events for better mobile interaction
        this.setupTouchEvents();
    }
    
    clampNumber(value, fallback, min, max) {
        const number = Number(value);
        if (!Number.isFinite(number)) {
            return fallback;
        }

        return Math.min(max, Math.max(min, Math.round(number)));
    }

    handleBrightnessInput() {
        if (this.brightnessInteractionStart === null) {
            this.brightnessInteractionStart = this.currentBrightness;
        }

        this.setBrightness(this.brightnessSlider.value, {
            previousValue: this.brightnessInteractionStart
        });
    }

    handleBrightnessChange() {
        this.brightnessInteractionStart = null;
        this.saveSettings();
    }

    setBrightness(value, options = {}) {
        const nextBrightness = this.clampNumber(value, this.defaultBrightness, 0, 1000);
        const previousValue = this.clampNumber(
            options.previousValue,
            this.currentBrightness,
            0,
            1000
        );

        if (nextBrightness !== this.currentBrightness) {
            if (options.trackPrevious) {
                this.previousBrightness = this.currentBrightness;
            } else if (options.previousValue !== undefined && previousValue !== nextBrightness) {
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

        this.applyBackground();

        // Update display
        this.brightnessValue.textContent = `${percentage}%`;
        this.brightnessSlider.setAttribute('aria-valuenow', this.currentBrightness);
        this.brightnessSlider.setAttribute('aria-valuetext', `${percentage}%`);

        // Update slider fill
        this.updateSliderFill();

        // Update preset buttons
        this.updatePresetButtons();

        // Update text colors for high brightness
        this.updateTextColors(percentage);
    }

    renderTemperature() {
        this.currentTemperature = this.clampNumber(this.temperatureSlider.value, this.defaultTemperature, 0, 100);
        this.temperatureSlider.value = String(this.currentTemperature);
        this.temperatureSlider.setAttribute('aria-valuenow', this.currentTemperature);
        this.temperatureSlider.setAttribute('aria-valuetext', `${this.currentTemperature}%`);

        this.applyBackground();
    }

    updateTemperature() {
        this.renderTemperature();
    }

    applyBackground() {
        const tempColor = this.getTemperatureColor();
        const opacity = (1000 - this.currentBrightness) / 1000;
        document.body.style.background = `linear-gradient(rgba(0, 0, 0, ${opacity}), rgba(0, 0, 0, ${opacity})), ${tempColor}`;
    }

    getTemperatureColor() {
        // Temperature: 0 = cool (blue-white), 50 = neutral (white), 100 = warm (amber)
        const temp = this.currentTemperature;

        if (temp <= 50) {
            // Cool to neutral: blend from blue-white to white
            const ratio = temp / 50;
            const r = Math.round(200 + (55 * ratio));
            const g = Math.round(220 + (35 * ratio));
            const b = 255;
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // Neutral to warm: blend from white to amber
            const ratio = (temp - 50) / 50;
            const r = 255;
            const g = Math.round(255 - (60 * ratio));
            const b = Math.round(255 - (155 * ratio));
            return `rgb(${r}, ${g}, ${b})`;
        }
    }

    updateSliderFill() {
        const percentage = (this.currentBrightness / 1000) * 100;
        this.brightnessSlider.style.setProperty('--slider-fill-percent', `${percentage}%`);
    }
    
    setPreset(preset, options = {}) {
        if (!Object.prototype.hasOwnProperty.call(this.presets, preset)) {
            return;
        }

        const value = this.presets[preset];
        this.setBrightness(value, { trackPrevious: options.trackPrevious !== false });

        if (options.save !== false) {
            this.saveSettings();
        }

        if (options.feedback !== false) {
            this.showFeedback(`Set to ${preset} brightness`);
        }
    }
    
    updatePresetButtons() {
        Object.keys(this.presets).forEach(preset => {
            const button = this.presetButtons[preset];
            const presetValue = this.presets[preset];
            const isActive = Math.abs(this.currentBrightness - presetValue) < 50;
            
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive);

            if (isActive) {
                button.style.removeProperty('color');
                button.style.removeProperty('border-color');
            }
        });
    }
    
    updateTextColors(percentage) {
        const isHighBrightness = percentage >= 76;
        const darkColor = 'rgba(0, 0, 0, 0.9)';
        const lightColor = 'rgba(255, 255, 255, 0.8)';
        const darkBorderColor = 'rgba(0, 0, 0, 0.4)';
        const lightBorderColor = 'rgba(255, 255, 255, 0.2)';
        
        // Update unselected preset buttons text color and border
        Object.values(this.presetButtons).forEach(button => {
            if (!button.classList.contains('active')) {
                button.style.color = isHighBrightness ? darkColor : lightColor;
                button.style.borderColor = isHighBrightness ? darkBorderColor : lightBorderColor;
            }
        });
        
        // Update slider labels text color
        document.querySelectorAll('.slider-label').forEach(label => {
            label.style.color = isHighBrightness ? darkColor : lightColor;
        });
        
        // Update percentage marker text color
        if (this.brightnessValue) {
            this.brightnessValue.style.color = isHighBrightness ? darkColor : lightColor;
        }
        
        // Update control buttons text color
        const controlButtons = [this.resetBtn, this.fullscreenBtn];
        controlButtons.forEach(button => {
            if (button) {
                button.style.color = isHighBrightness ? darkColor : lightColor;
            }
        });

        // Update branding text color
        if (this.branding) {
            this.branding.style.color = isHighBrightness ? darkColor : lightColor;
        }

        // Update help toggle button
        if (this.helpToggle) {
            if (this.helpToggle.classList.contains('active')) {
                this.helpToggle.style.removeProperty('color');
                this.helpToggle.style.removeProperty('border-color');
            } else {
                this.helpToggle.style.color = isHighBrightness ? darkColor : lightColor;
                this.helpToggle.style.borderColor = isHighBrightness ? darkBorderColor : lightBorderColor;
            }
        }

        // Update temperature labels
        const tempLabels = document.querySelectorAll('.temp-label');
        tempLabels.forEach(label => {
            if (label.classList.contains('temp-cool')) {
                label.style.color = isHighBrightness ? '#4a90d9' : '#a8d4ff';
            } else if (label.classList.contains('temp-warm')) {
                label.style.color = isHighBrightness ? '#cc7a30' : '#ffb366';
            }
        });
    }
    
    resetBrightness() {
        this.setBrightness(this.defaultBrightness, { trackPrevious: true });
        this.temperatureSlider.value = String(this.defaultTemperature);
        this.renderTemperature();
        this.saveSettings();
        this.showFeedback('Reset to defaults');
    }
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }
    
    enterFullscreen() {
        const elem = document.documentElement;
        let request;
        
        if (elem.requestFullscreen) {
            request = elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            request = elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            request = elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            request = elem.msRequestFullscreen();
        } else {
            this.showFeedback('Fullscreen unavailable');
        }

        this.handleFullscreenRequest(request, 'enter fullscreen');
    }
    
    exitFullscreen() {
        let request;

        if (document.exitFullscreen) {
            request = document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            request = document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            request = document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            request = document.msExitFullscreen();
        }

        this.handleFullscreenRequest(request, 'exit fullscreen');
    }

    handleFullscreenRequest(request, action) {
        if (request && typeof request.catch === 'function') {
            request.catch((error) => {
                console.warn(`Could not ${action}:`, error);
                this.showFeedback('Fullscreen unavailable');
            });
        }
    }
    
    handleFullscreenChange() {
        this.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        this.fullscreenBtn.textContent = this.isFullscreen ? 'Exit' : 'Fullscreen';
        this.fullscreenBtn.setAttribute('aria-label', 
            this.isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'
        );
    }
    
    
    handleKeydown(e) {
        if (this.shouldIgnoreShortcut(e)) {
            return;
        }

        // Prevent default for our shortcuts
        const shortcuts = [
            'ArrowLeft',
            'ArrowRight',
            'Space',
            'KeyR',
            'KeyF',
            'KeyH',
            'Digit1',
            'Digit2',
            'Digit3',
            'Digit4'
        ];
        if (shortcuts.includes(e.code)) {
            e.preventDefault();
        }
        
        switch (e.code) {
            case 'ArrowLeft':
                this.adjustBrightness(-50);
                break;
            case 'ArrowRight':
                this.adjustBrightness(50);
                break;
            case 'Space':
                this.toggleBrightness();
                break;
            case 'KeyR':
                this.resetBrightness();
                break;
            case 'KeyF':
                this.toggleFullscreen();
                break;
            case 'KeyH':
                this.toggleInstructions();
                break;
            case 'Digit1':
                this.setPreset('low');
                break;
            case 'Digit2':
                this.setPreset('medium');
                break;
            case 'Digit3':
                this.setPreset('high');
                break;
            case 'Digit4':
                this.setPreset('max');
                break;
        }
    }

    shouldIgnoreShortcut(event) {
        const target = event.target;
        if (!(target instanceof Element)) {
            return false;
        }

        return Boolean(target.closest('input, textarea, select, button, [contenteditable="true"]'));
    }
    
    adjustBrightness(delta) {
        this.setBrightness(this.currentBrightness + delta, { trackPrevious: true });
        this.saveSettings();
    }
    
    toggleBrightness() {
        const temp = this.currentBrightness;
        this.currentBrightness = this.clampNumber(this.previousBrightness, this.defaultBrightness, 0, 1000);
        this.previousBrightness = temp;

        this.brightnessSlider.value = String(this.currentBrightness);
        this.renderBrightness();
        this.saveSettings();
        this.showFeedback('Toggled brightness');
    }
    
    toggleInstructions() {
        this.isHelpVisible = !this.isHelpVisible;
        this.instructions.classList.toggle('visible', this.isHelpVisible);
        this.instructions.setAttribute('aria-hidden', String(!this.isHelpVisible));
        this.helpToggle.classList.toggle('active', this.isHelpVisible);
        this.helpToggle.setAttribute('aria-expanded', this.isHelpVisible);
        this.helpToggle.setAttribute(
            'aria-label',
            this.isHelpVisible ? 'Hide keyboard shortcuts' : 'Show keyboard shortcuts'
        );
        this.updateTextColors(Math.round((this.currentBrightness / 1000) * 100));
    }
    
    showFeedback(message) {
        // Clear any pending fade/removal
        if (this._feedbackTimer) clearTimeout(this._feedbackTimer);
        if (this._feedbackRemoveTimer) clearTimeout(this._feedbackRemoveTimer);

        let feedback = document.getElementById('feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'feedback';
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-size: 0.875rem;
                z-index: 1000;
                pointer-events: none;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.style.opacity = '1';

        this._feedbackTimer = setTimeout(() => {
            feedback.style.opacity = '0';
            this._feedbackRemoveTimer = setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 2000);
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('brightSupplySettings');
            if (saved) {
                const settings = JSON.parse(saved);
                if (!settings || typeof settings !== 'object') {
                    return;
                }

                this.currentBrightness = this.clampNumber(
                    settings.brightness,
                    this.defaultBrightness,
                    0,
                    1000
                );
                this.brightnessSlider.value = String(this.currentBrightness);
                this.currentTemperature = this.clampNumber(
                    settings.temperature,
                    this.defaultTemperature,
                    0,
                    100
                );
                this.temperatureSlider.value = String(this.currentTemperature);
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }

    applyLaunchPreset() {
        const params = new URLSearchParams(window.location.search);
        const preset = params.get('preset');

        if (!preset || !Object.prototype.hasOwnProperty.call(this.presets, preset)) {
            return;
        }

        this.setPreset(preset, {
            feedback: false,
            save: true,
            trackPrevious: true
        });
    }

    saveSettings() {
        try {
            const settings = {
                brightness: this.currentBrightness,
                temperature: this.currentTemperature
            };
            localStorage.setItem('brightSupplySettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('Could not save settings:', e);
        }
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            this.saveSettings();
        }
    }
    
    setupTouchEvents() {
        // Haptic feedback for supported devices
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('pointerdown', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.brightSupply = new BrightSupply();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    // Save settings one more time
    if (window.brightSupply) {
        window.brightSupply.saveSettings();
    }
});
