// 3D Effects System for Portfolio
class ThreeDEffects {
    constructor() {
        this.scenes = {};
        this.renderers = {};
        this.cameras = {};
        this.animationId = null;
        this.init();
    }

    init() {
        this.createGeometricBackground();
        this.createFloatingElements();
        this.createSkillCube();
        this.createEnhancedParticles();
        this.init3DCards();
        this.create3DText();
    }

    // 1. 3D Geometric Background
    createGeometricBackground() {
        const canvas = document.createElement('canvas');
        canvas.id = 'geometric-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.opacity = '0.3';
        document.body.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create multiple geometric shapes
        const geometries = [];
        const materials = [];

        // Torus Knot
        const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const torusKnotMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00d2ff,
            emissive: 0x00d2ff,
            emissiveIntensity: 0.2,
            shininess: 100,
            wireframe: false
        });
        const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        torusKnot.position.set(-3, 2, -5);
        scene.add(torusKnot);

        // Icosahedron
        const icosahedronGeometry = new THREE.IcosahedronGeometry(1.5, 0);
        const icosahedronMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.1,
            flatShading: true
        });
        const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
        icosahedron.position.set(3, -2, -8);
        scene.add(icosahedron);

        // Octahedron
        const octahedronGeometry = new THREE.OctahedronGeometry(1, 0);
        const octahedronMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.15,
            wireframe: true
        });
        const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
        octahedron.position.set(0, 0, -6);
        scene.add(octahedron);

        // Dodecahedron
        const dodecahedronGeometry = new THREE.DodecahedronGeometry(1.2, 0);
        const dodecahedronMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            emissive: 0x00ff00,
            emissiveIntensity: 0.1,
            flatShading: true
        });
        const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
        dodecahedron.position.set(-2, -3, -7);
        scene.add(dodecahedron);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00d2ff, 1, 100);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);

            torusKnot.rotation.x += 0.005;
            torusKnot.rotation.y += 0.007;
            
            icosahedron.rotation.x += 0.003;
            icosahedron.rotation.y += 0.005;
            
            octahedron.rotation.x += 0.007;
            octahedron.rotation.z += 0.005;
            
            dodecahedron.rotation.x += 0.004;
            dodecahedron.rotation.y += 0.006;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 2. Floating Elements for Hero Section (Removed)
    createFloatingElements() {
        // 3D boxes removed as requested
        return;
    }

    // 3. 3D Rotating Cube for Skills Section (Removed)
    createSkillCube() {
        // 3D rotating cube removed as requested
        return;
    }

    // 4. Enhanced 3D Particle System
    createEnhancedParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Create particle system
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCnt = 5000;
        const posArray = new Float32Array(particlesCnt * 3);
        const colorsArray = new Float32Array(particlesCnt * 3);

        for (let i = 0; i < particlesCnt * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 20;
            colorsArray[i] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 5;

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.001;
            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // 5. 3D Card Hover Effects
    init3DCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                card.style.transition = 'transform 0.1s ease-out';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
    }

    // 6. 3D Text Animations
    create3DText() {
        const nameElement = document.querySelector('.name');
        if (nameElement) {
            nameElement.style.textShadow = `
                0 1px 0 #ccc,
                0 2px 0 #c9c9c9,
                0 3px 0 #bbb,
                0 4px 0 #b9b9b9,
                0 5px 0 #aaa,
                0 6px 1px rgba(0,0,0,.1),
                0 0 5px rgba(0,0,0,.1),
                0 1px 3px rgba(0,0,0,.3),
                0 3px 5px rgba(0,0,0,.2),
                0 5px 10px rgba(0,0,0,.25),
                0 10px 10px rgba(0,0,0,.2),
                0 20px 20px rgba(0,0,0,.15)
            `;
            
            // Add floating animation
            nameElement.style.animation = 'float3D 3s ease-in-out infinite';
        }

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float3D {
                0%, 100% { transform: translateY(0px) rotateX(0deg); }
                50% { transform: translateY(-10px) rotateX(2deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize 3D effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        new ThreeDEffects();
    } else {
        console.warn('Three.js not loaded. Please include Three.js library.');
    }
});
