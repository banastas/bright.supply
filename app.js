/**
 * bright.supply - Main Application Script
 * Enhanced with keyboard shortcuts, presets, and persistence
 */

class BrightSupply {
    constructor() {
        this.brightnessSlider = document.getElementById('brightness');
        this.brightnessValue = document.getElementById('brightness-value');
        this.instructions = document.getElementById('instructions');
        this.phBadge = document.getElementById('product-hunt-badge');
        
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
        this.phToggle = document.getElementById('ph-toggle');
        
        // State
        this.currentBrightness = 1000;
        this.previousBrightness = 1000;
        this.isFullscreen = false;
        this.isPhBadgeVisible = false;
        
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
        this.hideInstructionsAfterDelay();
        this.updatePresetButtons();
        // Apply initial styling
        const percentage = Math.round((this.currentBrightness / 1000) * 100);
        this.updateUIStyling(percentage);
    }
    
    setupEventListeners() {
        // Brightness slider
        this.brightnessSlider.addEventListener('input', () => this.updateBrightness());
        this.brightnessSlider.addEventListener('change', () => this.saveSettings());
        
        // Preset buttons
        Object.keys(this.presetButtons).forEach(preset => {
            this.presetButtons[preset].addEventListener('click', () => this.setPreset(preset));
        });
        
        // Control buttons
        this.resetBtn.addEventListener('click', () => this.resetBrightness());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.phToggle.addEventListener('click', () => this.togglePhBadge());
        
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
    }
    
    updateBrightness() {
        this.currentBrightness = parseInt(this.brightnessSlider.value);
        const percentage = Math.round((this.currentBrightness / 1000) * 100);
        const opacity = (1000 - this.currentBrightness) / 1000;
        
        // Update background
        document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        
        // Update display
        this.brightnessValue.textContent = `${percentage}%`;
        this.brightnessSlider.setAttribute('aria-valuenow', this.currentBrightness);
        
        // Update preset buttons
        this.updatePresetButtons();
        
        // Update UI styling based on brightness level
        this.updateUIStyling(percentage);
        
        // Save settings
        this.saveSettings();
    }
    
    setPreset(preset) {
        const value = this.presets[preset];
        this.brightnessSlider.value = value;
        this.updateBrightness();
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
    
    updateUIStyling(percentage) {
        const isHighBrightness = percentage >= 76;
        
        // Toggle high brightness class on body
        document.body.classList.toggle('high-brightness', isHighBrightness);
        
        // Update all preset buttons
        Object.values(this.presetButtons).forEach(button => {
            if (isHighBrightness) {
                // High brightness styling - dark background with light text
                button.style.background = 'rgba(0, 0, 0, 0.8)';
                button.style.color = 'rgba(255, 255, 255, 0.95)';
                button.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                button.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
            } else {
                // Normal brightness styling - light background with dark text
                button.style.background = 'rgba(255, 255, 255, 0.9)';
                button.style.color = 'rgba(0, 0, 0, 0.9)';
                button.style.borderColor = 'rgba(0, 0, 0, 0.3)';
                button.style.textShadow = 'none';
            }
        });
        
        // Update control buttons
        const controlButtons = [this.resetBtn, this.fullscreenBtn, this.phToggle];
        controlButtons.forEach(button => {
            if (isHighBrightness) {
                // High brightness styling - dark background with light text
                button.style.background = 'rgba(0, 0, 0, 0.8)';
                button.style.color = 'rgba(255, 255, 255, 0.95)';
                button.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                button.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
            } else {
                // Normal brightness styling - light background with dark text
                button.style.background = 'rgba(255, 255, 255, 0.9)';
                button.style.color = 'rgba(0, 0, 0, 0.9)';
                button.style.borderColor = 'rgba(0, 0, 0, 0.3)';
                button.style.textShadow = 'none';
            }
        });
        
        // Update slider label
        if (isHighBrightness) {
            this.brightnessSlider.previousElementSibling.style.background = 'rgba(0, 0, 0, 0.8)';
            this.brightnessSlider.previousElementSibling.style.color = 'rgba(255, 255, 255, 0.95)';
            this.brightnessSlider.previousElementSibling.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            this.brightnessSlider.previousElementSibling.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
        } else {
            this.brightnessSlider.previousElementSibling.style.background = 'rgba(255, 255, 255, 0.95)';
            this.brightnessSlider.previousElementSibling.style.color = 'rgba(0, 0, 0, 0.9)';
            this.brightnessSlider.previousElementSibling.style.borderColor = 'rgba(0, 0, 0, 0.2)';
            this.brightnessSlider.previousElementSibling.style.textShadow = 'none';
        }
        
        // Update slider value
        if (isHighBrightness) {
            this.brightnessValue.style.background = 'rgba(0, 0, 0, 0.8)';
            this.brightnessValue.style.color = 'rgba(255, 255, 255, 0.95)';
            this.brightnessValue.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
        } else {
            this.brightnessValue.style.background = 'rgba(255, 255, 255, 0.2)';
            this.brightnessValue.style.color = 'rgba(0, 0, 0, 0.9)';
            this.brightnessValue.style.textShadow = '0 1px 2px rgba(255, 255, 255, 0.8)';
        }
    }
    
    resetBrightness() {
        this.brightnessSlider.value = 1000;
        this.updateBrightness();
        this.showFeedback('Reset to maximum brightness');
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
    
    togglePhBadge() {
        this.isPhBadgeVisible = !this.isPhBadgeVisible;
        this.phBadge.style.display = this.isPhBadgeVisible ? 'block' : 'none';
        this.phToggle.textContent = this.isPhBadgeVisible ? 'Hide PH' : 'Show PH';
        this.phToggle.setAttribute('aria-pressed', this.isPhBadgeVisible);
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
        this.instructions.classList.toggle('hidden');
        const isHidden = this.instructions.classList.contains('hidden');
        this.showFeedback(isHidden ? 'Instructions hidden' : 'Instructions shown');
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
    
    hideInstructionsAfterDelay() {
        setTimeout(() => {
            this.instructions.classList.add('hidden');
        }, 5000);
    }
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('brightSupplySettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.brightnessSlider.value = settings.brightness || 1000;
                this.isPhBadgeVisible = settings.showPhBadge || false;
                this.phBadge.style.display = this.isPhBadgeVisible ? 'block' : 'none';
                this.phToggle.textContent = this.isPhBadgeVisible ? 'Hide PH' : 'Show PH';
                this.phToggle.setAttribute('aria-pressed', this.isPhBadgeVisible);
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }
    
    saveSettings() {
        try {
            const settings = {
                brightness: this.currentBrightness,
                showPhBadge: this.isPhBadgeVisible,
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
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BrightSupply();
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
