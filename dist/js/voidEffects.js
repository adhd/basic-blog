// Class definitions first
class VoidMessage {
    constructor(text, type) {
        this.id = Date.now() + Math.random();
        this.text = text;
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.element = this.createElement();
    }

    createElement() {
        const elem = document.createElement('div');
        elem.className = `void-message ${this.type}`;
        elem.innerHTML = `<p>${this.text}</p>`;
        return elem;
    }
}
class VoidBoard {
    constructor() {
        console.log('VoidBoard constructor called');
        this.messages = [];
        this.isInChaosMode = false;
        this.voidSpace = document.getElementById('void-space');
        this.isMobile = window.innerWidth < 768;
        
        // Clear all existing messages
        this.clearAllMessages();
        
        console.log('Setting up void space...');
        this.setupVoidSpace();
        console.log('Loading messages...');
        this.loadMessages();
        console.log('Starting animation...');
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }

    clearAllMessages() {
        // Clear messages array
        this.messages = [];
        
        // Clear DOM elements
        if (this.voidSpace) {
            while (this.voidSpace.firstChild) {
                this.voidSpace.removeChild(this.voidSpace.firstChild);
            }
        }
        
        // Clear localStorage
        localStorage.removeItem('voidMessages');
    }

    setupVoidSpace() {
        if (!this.voidSpace) return;

        // Use full viewport for both mobile and desktop
        this.voidSpace.style.position = 'fixed';
        this.voidSpace.style.top = '0';
        this.voidSpace.style.left = '0';
        this.voidSpace.style.width = '100vw';
        this.voidSpace.style.height = '100vh';
        this.voidSpace.style.overflow = 'visible';
        this.voidSpace.style.pointerEvents = 'none';

        // Set bounds to full viewport plus buffer
        this.bounds = {
            width: window.innerWidth + 600, // Add buffer for smooth transitions
            height: window.innerHeight + 200
        };

        // Center the initial spawn point
        this.spawnX = window.innerWidth / 2;
        this.spawnY = window.innerHeight / 2;
    }

    handleResize() {
        this.isMobile = window.innerWidth < 768;
        this.setupVoidSpace();
    }

    loadMessages() {
        try {
            const saved = localStorage.getItem('voidMessages');
            if (saved) {
                console.log('Loading saved messages:', saved);
                const messages = JSON.parse(saved);
                messages.forEach(m => this.addMessage(m.text, 'void-message'));
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    addMessage(text, type) {
        const message = new VoidMessage(text, type);
        
        // Use the full viewport for initial positions
        const margin = 100; // Keep away from edges
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Try to find a good position with minimal overlap
        let bestX = 0;
        let bestY = 0;
        let bestDistance = 0;
        const attempts = 20; // Number of positions to try
        
        for (let i = 0; i < attempts; i++) {
            // Generate random position within viewport
            const tryX = margin + Math.random() * (viewportWidth - margin * 2);
            const tryY = margin + Math.random() * (viewportHeight - margin * 2);
            
            // Find minimum distance to other messages
            let minDistance = Infinity;
            for (const other of this.messages) {
                const dx = tryX - other.x;
                const dy = tryY - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                minDistance = Math.min(minDistance, distance);
            }
            
            // Keep track of best position found
            if (minDistance > bestDistance) {
                bestDistance = minDistance;
                bestX = tryX;
                bestY = tryY;
            }
        }
        
        // Use the best position found
        message.x = bestX;
        message.y = bestY;
        
        // Give initial random velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random();
        message.vx = Math.cos(angle) * speed;
        message.vy = Math.sin(angle) * speed;
        
        this.messages.push(message);
        this.voidSpace.appendChild(message.element);
        message.element.style.transform = `translate(${message.x}px, ${message.y}px)`;
        this.saveMessages();
    }

    saveMessages() {
        try {
            const messages = this.messages.map(m => ({
                text: m.text,
                type: m.type
            }));
            localStorage.setItem('voidMessages', JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving messages:', error);
        }
    }

    animate() {
        // Update each message position
        this.messages.forEach(message => {
            this.updateMessagePosition(message);
        });
        
        requestAnimationFrame(() => this.animate());
    }

    updateMessagePosition(message) {
        // Softer repulsion parameters
        const repulsionDistance = 250;
        const repulsionStrength = 0.15;
        const damping = 0.98;
        const randomForce = 0.03;
        const minSpeed = 0.3;
        const maxSpeed = 3;

        if (!this.isInChaosMode) {
            // Apply smooth repulsion between bubbles
            this.messages.forEach(other => {
                if (other !== message) {
                    const dx = message.x - other.x;
                    const dy = message.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < repulsionDistance) {
                        const force = Math.pow((repulsionDistance - distance) / repulsionDistance, 2) * repulsionStrength;
                        const angle = Math.atan2(dy, dx);
                        
                        message.vx += Math.cos(angle) * force;
                        message.vy += Math.sin(angle) * force;
                    }
                }
            });

            // Add very slight random movement
            message.vx += (Math.random() - 0.5) * randomForce;
            message.vy += (Math.random() - 0.5) * randomForce;

            // Ensure minimum movement
            const speed = Math.sqrt(message.vx * message.vx + message.vy * message.vy);
            if (speed < minSpeed) {
                const factor = (minSpeed / speed) * 0.1;
                message.vx *= 1 + factor;
                message.vy *= 1 + factor;
            }

            // Limit maximum speed
            if (speed > maxSpeed) {
                const factor = maxSpeed / speed;
                message.vx *= factor;
                message.vy *= factor;
            }
        }

        // Update position
        message.x += message.vx;
        message.y += message.vy;

        // Apply smooth damping
        message.vx *= damping;
        message.vy *= damping;

        // Screen wrapping
        if (message.x < -300) message.x = this.bounds.width;
        if (message.x > this.bounds.width) message.x = -300;
        if (message.y < -100) message.y = this.bounds.height;
        if (message.y > this.bounds.height) message.y = -100;

        // Apply transform
        message.element.style.transform = `translate(${message.x}px, ${message.y}px)`;
    }

    toggleChaos() {
        this.isInChaosMode = !this.isInChaosMode;
        
        this.messages.forEach(message => {
            if (this.isInChaosMode) {
                // Initial burst with varied speeds
                const burstSpeed = 20 + Math.random() * 30;
                const angle = Math.random() * Math.PI * 2;
                message.vx = Math.cos(angle) * burstSpeed;
                message.vy = Math.sin(angle) * burstSpeed;
                
                // Initialize chaos properties
                message.rotation = Math.random() * 360;
                message.rotationSpeed = (Math.random() - 0.5) * 8;
                message.scale = 0.8 + Math.random() * 0.4;
                message.scaleSpeed = (Math.random() - 0.5) * 0.1;
                message.swingPhase = Math.random() * Math.PI * 2;
                message.swingAmplitude = 10 + Math.random() * 20;
                message.element.classList.add('chaos');
            } else {
                // Smooth return to normal
                message.vx = (Math.random() - 0.5) * 2;
                message.vy = (Math.random() - 0.5) * 2;
                message.rotation = 0;
                message.scale = 1;
                message.element.classList.remove('chaos');
                message.element.style.transform = `translate(${message.x}px, ${message.y}px)`;
            }
        });
    }
}

// Add this near the top of the file
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    console.log('Theme toggle element:', themeToggle);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', (e) => {
            console.log('Theme toggle clicked', e);
            // ... rest of theme toggle logic
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up theme toggle...');
    setupThemeToggle();
    console.log('DOM loaded');
    
    if (document.getElementById('particles-js')) {
        console.log('Found particles container, initializing...');
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#8080ff"
                },
                "shape": {
                    "type": "circle"
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#8080ff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    }
                }
            },
            "retina_detect": true
        });
    } else {
        console.error('particles-js element not found');
    }

    // Initialize void board
    if (document.getElementById('void-space')) {
        console.log('Found void-space, initializing board...');
        window.voidBoard = new VoidBoard();
        console.log('VoidBoard initialized:', window.voidBoard);
        
        // Set up form handler
        const form = document.getElementById('void-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const messageInput = form.querySelector('.message-input');
                
                if (messageInput) {
                    const text = messageInput.value.trim();
                    if (text) {
                        // Just use a default type since they all look the same
                        window.voidBoard.addMessage(text, 'void-message');
                        messageInput.value = '';
                    }
                }
            });
        }
    } else {
        console.error('void-space element not found');
    }

    // Add navigation toggle handler
    const header = document.querySelector('header');
    const navToggle = document.querySelector('.nav-toggle');
    if (header && navToggle) {
        navToggle.addEventListener('click', () => {
            header.classList.toggle('visible');
        });
    }

    // Theme initialization and toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;
    
    if (themeToggle) {
        console.log('Found theme toggle, initializing...');
        
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            console.log('Applying saved theme:', savedTheme);
            root.setAttribute('data-theme', savedTheme);
        }

        themeToggle.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            console.log('Switching theme to:', newTheme);
            
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Add visual feedback
            themeToggle.style.transform = `rotate(${Math.random() * 360}deg)`;
        });
    } else {
        console.error('Theme toggle button not found');
    }

    // Add chaos button handler
    const chaosButton = document.querySelector('.chaos-button');
    console.log('Looking for chaos button...', chaosButton);

    if (chaosButton) {
        console.log('Found chaos button, initializing...');
        chaosButton.addEventListener('click', (e) => {
            console.log('Chaos button clicked', e);
            if (window.voidBoard) {
                console.log('VoidBoard exists, toggling chaos...');
                console.log('Current chaos state:', window.voidBoard.isInChaosMode);
                window.voidBoard.toggleChaos();
                console.log('New chaos state:', window.voidBoard.isInChaosMode);
                
                // Add visual feedback with transition
                chaosButton.style.transition = 'transform 0.5s ease';
                chaosButton.style.transform = window.voidBoard.isInChaosMode ? 'rotate(720deg)' : 'rotate(0deg)';
            } else {
                console.error('VoidBoard not initialized');
            }
        });
    } else {
        console.error('Chaos button not found');
    }
}); 