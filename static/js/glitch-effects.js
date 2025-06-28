// Glitch Bloom - Advanced Glitch Effects

class GlitchEffectManager {
    constructor() {
        this.effects = [];
        this.isActive = true;
        this.init();
    }
    
    init() {
        this.createGlitchCanvas();
        this.setupGlobalEffects();
        this.startEffectLoop();
    }
    
    // Create invisible canvas for advanced effects
    createGlitchCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9998';
        this.canvas.style.opacity = '0.03';
        this.canvas.style.mixBlendMode = 'screen';
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.body.appendChild(this.canvas);
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // Setup global glitch effects
    setupGlobalEffects() {
        // Digital noise background (much more subtle)
        this.addEffect('noise', () => this.digitalNoise(), 500);
        
        // Screen tear effect (less frequent)
        this.addEffect('tear', () => this.screenTear(), 15000);
        
        // Chromatic aberration (less frequent)
        this.addEffect('chromatic', () => this.chromaticAberration(), 10000);
        
        // Matrix rain (very subtle)
        this.addEffect('matrix', () => this.matrixRain(), 1000);
        
        // Pixel corruption (less frequent)
        this.addEffect('corruption', () => this.pixelCorruption(), 20000);
        
        // Data stream (less frequent)
        this.addEffect('datastream', () => this.dataStream(), 2000);
    }
    
    addEffect(name, callback, interval) {
        const effect = {
            name,
            callback,
            interval,
            lastRun: 0,
            active: true
        };
        
        this.effects.push(effect);
    }
    
    startEffectLoop() {
        const loop = () => {
            if (!this.isActive) return;
            
            const now = Date.now();
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Run effects
            this.effects.forEach(effect => {
                if (effect.active && (now - effect.lastRun) >= effect.interval) {
                    try {
                        effect.callback();
                        effect.lastRun = now;
                    } catch (e) {
                        console.warn(`Glitch effect ${effect.name} failed:`, e);
                    }
                }
            });
            
            requestAnimationFrame(loop);
        };
        
        requestAnimationFrame(loop);
    }
    
    // Digital noise effect
    digitalNoise() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.001) { // Very sparse noise
                const intensity = Math.random() * 255;
                data[i] = 0;     // Red
                data[i + 1] = intensity; // Green (matrix style)
                data[i + 2] = intensity * 0.3; // Blue
                data[i + 3] = 50; // Alpha
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    // Screen tear effect
    screenTear() {
        if (Math.random() > 0.1) return; // 10% chance
        
        const tearHeight = Math.random() * 5 + 1;
        const tearY = Math.random() * this.canvas.height;
        
        this.ctx.fillStyle = '#00FF41';
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillRect(0, tearY, this.canvas.width, tearHeight);
        this.ctx.globalAlpha = 1;
        
        // Add displacement
        setTimeout(() => {
            const elements = document.querySelectorAll('.garden-area, .plant-sprite');
            elements.forEach(el => {
                if (Math.random() < 0.3) {
                    el.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
                    setTimeout(() => {
                        el.style.transform = '';
                    }, 100);
                }
            });
        }, 50);
    }
    
    // Chromatic aberration
    chromaticAberration() {
        if (Math.random() > 0.05) return; // 5% chance
        
        const aberrationElements = document.querySelectorAll('.glitch-text, .plant-sprite');
        aberrationElements.forEach(el => {
            if (Math.random() < 0.2) {
                el.style.textShadow = '2px 0 0 #FF0080, -2px 0 0 #00FF41';
                el.style.filter = 'blur(0.5px)';
                
                setTimeout(() => {
                    el.style.textShadow = '';
                    el.style.filter = '';
                }, 200);
            }
        });
    }
    
    // Matrix rain effect
    matrixRain() {
        if (Math.random() > 0.1) return; // 10% chance
        
        const chars = '01';
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * 100; // Only top portion
        
        this.ctx.fillStyle = '#00FF41';
        this.ctx.globalAlpha = 0.3;
        this.ctx.font = '12px JetBrains Mono';
        this.ctx.fillText(char, x, y);
        this.ctx.globalAlpha = 1;
    }
    
    // Pixel corruption
    pixelCorruption() {
        if (Math.random() > 0.02) return; // 2% chance
        
        const corruptionSize = Math.random() * 20 + 5;
        const x = Math.random() * (this.canvas.width - corruptionSize);
        const y = Math.random() * (this.canvas.height - corruptionSize);
        
        this.ctx.fillStyle = '#FF0080';
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillRect(x, y, corruptionSize, corruptionSize);
        this.ctx.globalAlpha = 1;
        
        // Add pixel grid effect
        this.ctx.strokeStyle = '#8A2BE2';
        this.ctx.globalAlpha = 0.1;
        this.ctx.strokeRect(x, y, corruptionSize, corruptionSize);
        this.ctx.globalAlpha = 1;
    }
    
    // Data stream effect
    dataStream() {
        if (Math.random() > 0.05) return; // 5% chance
        
        const streamLength = Math.random() * 100 + 20;
        const x = Math.random() * this.canvas.width;
        
        this.ctx.strokeStyle = '#00FF41';
        this.ctx.globalAlpha = 0.2;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, streamLength);
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    // Public methods for external control
    enableEffect(name) {
        const effect = this.effects.find(e => e.name === name);
        if (effect) effect.active = true;
    }
    
    disableEffect(name) {
        const effect = this.effects.find(e => e.name === name);
        if (effect) effect.active = false;
    }
    
    triggerIntenseGlitch() {
        // Temporarily increase all effect frequencies
        const originalIntervals = this.effects.map(e => e.interval);
        
        this.effects.forEach(effect => {
            effect.interval = Math.max(effect.interval / 10, 10);
        });
        
        // Restore after 2 seconds
        setTimeout(() => {
            this.effects.forEach((effect, index) => {
                effect.interval = originalIntervals[index];
            });
        }, 2000);
    }
    
    destroy() {
        this.isActive = false;
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Text scramble effect
class TextScrambler {
    constructor(element, text, scrambleDuration = 2000) {
        this.element = element;
        this.originalText = text;
        this.scrambleDuration = scrambleDuration;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.isScrambling = false;
    }
    
    scramble() {
        if (this.isScrambling) return;
        
        this.isScrambling = true;
        const startTime = Date.now();
        const textLength = this.originalText.length;
        
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.scrambleDuration, 1);
            
            let newText = '';
            
            for (let i = 0; i < textLength; i++) {
                if (progress * textLength > i) {
                    newText += this.originalText[i];
                } else {
                    newText += this.chars[Math.floor(Math.random() * this.chars.length)];
                }
            }
            
            this.element.textContent = newText;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                this.element.textContent = this.originalText;
                this.isScrambling = false;
            }
        };
        
        requestAnimationFrame(update);
    }
}

// Terminal cursor effect
class TerminalCursor {
    constructor(element) {
        this.element = element;
        this.cursor = document.createElement('span');
        this.cursor.className = 'terminal-cursor-inline';
        this.cursor.style.cssText = `
            display: inline-block;
            width: 8px;
            height: 1em;
            background-color: #00FF41;
            margin-left: 2px;
            animation: blink 1s infinite;
        `;
        
        // Add blink animation if not exists
        if (!document.getElementById('cursor-blink-style')) {
            const style = document.createElement('style');
            style.id = 'cursor-blink-style';
            style.textContent = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.element.appendChild(this.cursor);
    }
    
    remove() {
        if (this.cursor && this.cursor.parentNode) {
            this.cursor.parentNode.removeChild(this.cursor);
        }
    }
}

// Glitch button effect
function addGlitchButtonEffect(selector) {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener('mouseenter', () => {
            const originalText = button.textContent;
            const scrambler = new TextScrambler(button, originalText, 500);
            scrambler.scramble();
        });
        
        button.addEventListener('click', () => {
            // Add click glitch effect
            button.style.transform = 'scale(0.95)';
            button.style.filter = 'hue-rotate(90deg)';
            
            setTimeout(() => {
                button.style.transform = '';
                button.style.filter = '';
            }, 150);
        });
    });
}

// Page load glitch sequence
function initializePageGlitch() {
    // Screen flash on load
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #00FF41;
        z-index: 10000;
        opacity: 0.3;
        pointer-events: none;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            document.body.removeChild(flash);
        }, 300);
    }, 100);
    
    // Scramble page title
    const title = document.querySelector('h1, .glitch-text');
    if (title) {
        const scrambler = new TextScrambler(title, title.textContent);
        setTimeout(() => scrambler.scramble(), 500);
    }
}

// Initialize all glitch effects
let glitchManager;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize glitch effect manager
    glitchManager = new GlitchEffectManager();
    
    // Add glitch effects to interactive elements
    addGlitchButtonEffect('button, .btn, a.kofi-button');
    
    // Initialize page load effects
    setTimeout(initializePageGlitch, 100);
    
    // Add terminal cursors to specific elements
    const terminalElements = document.querySelectorAll('.echo-prompt, .terminal-title');
    terminalElements.forEach(el => {
        if (!el.querySelector('.terminal-cursor-inline')) {
            new TerminalCursor(el);
        }
    });
    
    // Trigger intense glitch on specific events
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && glitchManager) {
            glitchManager.triggerIntenseGlitch();
        }
    });
});

// Export for external use
window.GlitchEffects = {
    manager: () => glitchManager,
    TextScrambler,
    TerminalCursor,
    addGlitchButtonEffect,
    triggerIntenseGlitch: () => glitchManager?.triggerIntenseGlitch()
};
