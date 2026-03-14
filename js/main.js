// Main JavaScript File

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------
       1. Navigation & Hamburger Menu
    ----------------------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        });
    });

    // Sticky Navbar Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(li => {
            li.querySelector('a').classList.remove('active');
            if (li.querySelector('a').getAttribute('href').includes(current)) {
                li.querySelector('a').classList.add('active');
            }
        });
    });

    /* -----------------------------------------------
       2. Typing Text Effect
    ----------------------------------------------- */
    const typingText = document.querySelector('.typing-text');
    const words = ["Python Developer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing effect
    setTimeout(type, 1000);


    /* -----------------------------------------------
       3. Scroll Animations (Reveal)
    ----------------------------------------------- */
    // Helper: add 'reveal' class to elements with data-aos
    const revealElements = document.querySelectorAll('[data-aos]');

    revealElements.forEach(el => {
        const animationType = el.getAttribute('data-aos');
        if (animationType === 'fade-up' || animationType === 'slide-up') {
            el.classList.add('reveal');
        } else if (animationType === 'fade-left') {
            el.classList.add('reveal-left');
        } else if (animationType === 'fade-right') {
            el.classList.add('reveal-right');
        }
    });

    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            } else {
                // reveals[i].classList.remove('active'); // Optional: reset on scroll up
            }
        }
    };

    window.addEventListener('scroll', reveal);
    reveal(); // Trigger once on load




    /* -----------------------------------------------
       5. Accordion (Experience)
    ----------------------------------------------- */
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // Close other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    /* -----------------------------------------------
       6. 3D Cosmic Background (Three.js)
    ----------------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    if (typeof THREE !== 'undefined' && canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 1. Starfield Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 4000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 12;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.008,
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // 2. Central Nebula / Glowing Ring
        const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xcb6ce6, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        scene.add(ring);

        // Secondary inner glowing ring
        const ringGeo2 = new THREE.TorusGeometry(1.4, 0.01, 16, 100);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x5b21b6, transparent: true, opacity: 0.2 });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        scene.add(ring2);

        // 3. Floating Orbital Shapes
        const shapes = [];
        const materialNodes = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 });

        const node1 = new THREE.IcosahedronGeometry(0.8, 0);
        const mesh1 = new THREE.Mesh(node1, materialNodes);
        mesh1.position.set(-4, 1.5, -4);

        const node2 = new THREE.OctahedronGeometry(0.6, 0);
        const mesh2 = new THREE.Mesh(node2, materialNodes);
        mesh2.position.set(4, -1.8, -3);

        shapes.push(mesh1, mesh2);
        scene.add(mesh1, mesh2);

        camera.position.z = 4.5;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const clock = new THREE.Clock();

        function animate3D() {
            requestAnimationFrame(animate3D);
            const elapsedTime = clock.getElapsedTime();

            targetX = mouseX * 0.0005;
            targetY = mouseY * 0.0005;

            // Particles rotation
            particlesMesh.rotation.y = elapsedTime * 0.03;

            // Central rings animation
            ring.rotation.x = elapsedTime * 0.2;
            ring.rotation.y = elapsedTime * 0.15;
            ring2.rotation.x = -elapsedTime * 0.15;
            ring2.rotation.y = -elapsedTime * 0.2;

            // Shapes rotation
            shapes.forEach((shape, index) => {
                shape.rotation.y = elapsedTime * (0.1 + index * 0.05);
                shape.rotation.z = elapsedTime * (0.05);
            });

            // Parallax
            camera.position.x += (mouseX * 0.0012 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 0.0012 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }
        animate3D();
    }

    /* -----------------------------------------------
       7. Project Card Click-to-Reveal Overlay
    ----------------------------------------------- */
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const isActive = card.classList.contains('overlay-active');

            // Close all other overlays first
            projectCards.forEach(c => c.classList.remove('overlay-active'));

            // Toggle this card (open if was closed, stay closed if was open)
            if (!isActive) {
                card.classList.add('overlay-active');
            }
        });
    });

    // Close overlay when clicking outside any project card
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-card')) {
            projectCards.forEach(c => c.classList.remove('overlay-active'));
        }
    });

    /* -----------------------------------------------
       8. 3D Card Hover Effects (VanillaTilt)
    ----------------------------------------------- */
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll(".glass-card, .project-card, .experience-card, .cert-card, .img-wrapper, .skill-category, .timeline-content");
        VanillaTilt.init(tiltElements, {
            max: 18,               // Max tilt rotation
            speed: 400,            // Speed of the enter/exit transition
            glare: true,           // Add a glare effect
            "max-glare": 0.25,     // Max glare opacity
            scale: 1.05            // Scale up on hover
        });

        // Disable tilt on small screens for better UX
        if (window.innerWidth <= 768) {
            tiltElements.forEach(el => {
                if (el.vanillaTilt) {
                    el.vanillaTilt.destroy();
                }
            });
        }
    }

});
