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
        this.currentBrightness = 750;
        this.previousBrightness = 750;
        this.currentTemperature = 50;
        this.isFullscreen = false;
        this.isHelpVisible = false;

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
        this.setupEventListeners();
        this.updateBrightness();
        this.updateTemperature();
        this.updatePresetButtons();
        this.updateSliderFill();
        // Apply initial text colors
        const percentage = Math.round((this.currentBrightness / 1000) * 100);
        this.updateTextColors(percentage);
    }
    
    setupEventListeners() {
        // Brightness slider
        this.brightnessSlider.addEventListener('input', () => {
            this.updateBrightness();
            this.updateSliderFill();
        });
        this.brightnessSlider.addEventListener('change', () => this.saveSettings());

        // Temperature slider
        this.temperatureSlider.addEventListener('input', () => this.updateTemperature());
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
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Orientation change
        window.addEventListener('orientationchange', () => this.handleOrientationChange());
        
        // Touch events for better mobile interaction
        this.setupTouchEvents();
    }
    
    updateBrightness() {
        this.currentBrightness = parseInt(this.brightnessSlider.value);
        const percentage = Math.round((this.currentBrightness / 1000) * 100);

        // Calculate base color from temperature
        const tempColor = this.getTemperatureColor();

        // Apply brightness as opacity overlay
        const opacity = (1000 - this.currentBrightness) / 1000;
        document.body.style.background = `linear-gradient(rgba(0, 0, 0, ${opacity}), rgba(0, 0, 0, ${opacity})), ${tempColor}`;

        // Update display
        this.brightnessValue.textContent = `${percentage}%`;
        this.brightnessSlider.setAttribute('aria-valuenow', this.currentBrightness);

        // Update slider fill
        this.updateSliderFill();

        // Update preset buttons
        this.updatePresetButtons();

        // Update text colors for high brightness
        this.updateTextColors(percentage);

        // Save settings
        this.saveSettings();
    }

    updateTemperature() {
        this.currentTemperature = parseInt(this.temperatureSlider.value);
        this.temperatureSlider.setAttribute('aria-valuenow', this.currentTemperature);

        // Re-apply brightness with new temperature
        this.updateBrightness();
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
    
    setPreset(preset) {
        const value = this.presets[preset];
        this.brightnessSlider.value = value;
        this.updateBrightness();
        this.updateSliderFill();
        this.showFeedback(`Set to ${preset} brightness`);
    }
    
    updatePresetButtons() {
        Object.keys(this.presets).forEach(preset => {
            const button = this.presetButtons[preset];
            const presetValue = this.presets[preset];
            const isActive = Math.abs(this.currentBrightness - presetValue) < 50;
            
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive);
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
        
        // Update "Brightness" label text color
        const sliderLabel = document.querySelector('.slider-label');
        if (sliderLabel) {
            sliderLabel.style.color = isHighBrightness ? darkColor : lightColor;
        }
        
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

        // Update help toggle button (when not active)
        if (this.helpToggle && !this.helpToggle.classList.contains('active')) {
            this.helpToggle.style.color = isHighBrightness ? darkColor : lightColor;
            this.helpToggle.style.borderColor = isHighBrightness ? darkBorderColor : lightBorderColor;
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
        this.brightnessSlider.value = 750;
        this.temperatureSlider.value = 50;
        this.currentTemperature = 50;
        this.updateBrightness();
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
        
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
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
        // Prevent default for our shortcuts
        const shortcuts = ['ArrowLeft', 'ArrowRight', 'Space', 'KeyR', 'KeyF', 'KeyH'];
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
    
    adjustBrightness(delta) {
        const newValue = Math.max(0, Math.min(1000, this.currentBrightness + delta));
        this.brightnessSlider.value = newValue;
        this.updateBrightness();
    }
    
    toggleBrightness() {
        const temp = this.currentBrightness;
        this.currentBrightness = this.previousBrightness;
        this.previousBrightness = temp;
        
        this.brightnessSlider.value = this.currentBrightness;
        this.updateBrightness();
        this.showFeedback('Toggled brightness');
    }
    
    toggleInstructions() {
        this.isHelpVisible = !this.isHelpVisible;
        this.instructions.classList.toggle('visible', this.isHelpVisible);
        this.helpToggle.classList.toggle('active', this.isHelpVisible);
        this.helpToggle.setAttribute('aria-expanded', this.isHelpVisible);
    }
    
    showFeedback(message) {
        // Create or update feedback element
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
        
        setTimeout(() => {
            feedback.style.opacity = '0';
        }, 2000);
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('brightSupplySettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.brightnessSlider.value = settings.brightness || 750;
                this.currentBrightness = settings.brightness || 750;
                this.temperatureSlider.value = settings.temperature ?? 50;
                this.currentTemperature = settings.temperature ?? 50;
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }

    saveSettings() {
        try {
            const settings = {
                brightness: this.currentBrightness,
                temperature: this.currentTemperature,
                timestamp: Date.now()
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
    
    handleResize() {
        // Handle any resize-specific logic if needed
        this.updatePresetButtons();
    }
    
    handleOrientationChange() {
        // Delay to allow viewport to adjust
        setTimeout(() => {
            this.updatePresetButtons();
            this.updateBrightness();
        }, 100);
    }
    
    setupTouchEvents() {
        // Prevent double-tap zoom on buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.click();
            });
        });
        
        // Improve slider touch interaction
        this.brightnessSlider.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });
        
        this.brightnessSlider.addEventListener('touchend', (e) => {
            e.stopPropagation();
        });
        
        // Add haptic feedback for supported devices
        this.addHapticFeedback();
    }
    
    addHapticFeedback() {
        // Add subtle haptic feedback for touch interactions
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10); // Very short vibration
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

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrightSupply;
}
