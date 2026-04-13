// Background Effects - Ambient and Subtle
class BackgroundEffects {
    constructor() {
        this.init();
    }

    init() {
        this.createFloatingOrbs();
        this.createParticles();
        this.createStarfield();
        this.createGeometricShapes();
        this.createAurora();
        this.createWaveEffect();
        this.createAnimatedGrid();
    }

    // Create floating orbs
    createFloatingOrbs() {
        const container = document.createElement('div');
        container.className = 'floating-orbs';
        document.body.appendChild(container);

        const orbData = [
            { class: 'orb1', size: 300, color: '#00d2ff' },
            { class: 'orb2', size: 200, color: '#ff00ff' },
            { class: 'orb3', size: 250, color: '#ffff00' },
            { class: 'orb4', size: 180, color: '#00ff00' }
        ];

        orbData.forEach(orb => {
            const orbElement = document.createElement('div');
            orbElement.className = `orb ${orb.class}`;
            container.appendChild(orbElement);
        });
    }

    // Create floating particles
    createParticles() {
        const container = document.createElement('div');
        container.className = 'particles-container';
        document.body.appendChild(container);

        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    }

    // Create starfield effect
    createStarfield() {
        const container = document.createElement('div');
        container.className = 'starfield';
        document.body.appendChild(container);

        const starCount = 50;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            container.appendChild(star);
        }
    }

    // Create geometric shapes
    createGeometricShapes() {
        const container = document.createElement('div');
        container.className = 'geometric-bg';
        document.body.appendChild(container);

        const shapes = ['triangle', 'circle', 'square'];
        shapes.forEach(shape => {
            const shapeElement = document.createElement('div');
            shapeElement.className = `geo-shape ${shape}`;
            container.appendChild(shapeElement);
        });
    }

    // Create aurora effect
    createAurora() {
        const aurora = document.createElement('div');
        aurora.className = 'aurora';
        document.body.appendChild(aurora);
    }

    // Create wave effect
    createWaveEffect() {
        const waveContainer = document.createElement('div');
        waveContainer.className = 'wave-bg';
        document.body.appendChild(waveContainer);

        const wave = document.createElement('div');
        wave.className = 'wave';
        waveContainer.appendChild(wave);
    }

    // Create animated grid
    createAnimatedGrid() {
        const grid = document.createElement('div');
        grid.className = 'animated-grid';
        document.body.appendChild(grid);
    }

    // Interactive mouse effect
    createMouseEffect() {
        const mouseLight = document.createElement('div');
        mouseLight.style.position = 'fixed';
        mouseLight.style.width = '200px';
        mouseLight.style.height = '200px';
        mouseLight.style.borderRadius = '50%';
        mouseLight.style.background = 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)';
        mouseLight.style.pointerEvents = 'none';
        mouseLight.style.zIndex = '9999';
        mouseLight.style.transform = 'translate(-50%, -50%)';
        mouseLight.style.transition = 'opacity 0.3s ease';
        mouseLight.style.opacity = '0';
        document.body.appendChild(mouseLight);

        document.addEventListener('mousemove', (e) => {
            mouseLight.style.left = e.clientX + 'px';
            mouseLight.style.top = e.clientY + 'px';
            mouseLight.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            mouseLight.style.opacity = '0';
        });
    }

    // Dynamic color theme based on time
    setTimeBasedTheme() {
        const hour = new Date().getHours();
        const body = document.body;
        
        if (hour >= 6 && hour < 12) {
            // Morning theme
            body.style.setProperty('--primary-color', '#ff6b6b');
            body.style.setProperty('--secondary-color', '#4ecdc4');
        } else if (hour >= 12 && hour < 18) {
            // Afternoon theme
            body.style.setProperty('--primary-color', '#45b7d1');
            body.style.setProperty('--secondary-color', '#96ceb4');
        } else if (hour >= 18 && hour < 22) {
            // Evening theme
            body.style.setProperty('--primary-color', '#f7b731');
            body.style.setProperty('--secondary-color', '#5f27cd');
        } else {
            // Night theme
            body.style.setProperty('--primary-color', '#00d2ff');
            body.style.setProperty('--secondary-color', '#ff00ff');
        }
    }
}

// Initialize background effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const backgroundEffects = new BackgroundEffects();
    
    // Optional: Add mouse effect
    // backgroundEffects.createMouseEffect();
    
    // Optional: Set time-based theme
    // backgroundEffects.setTimeBasedTheme();
});
