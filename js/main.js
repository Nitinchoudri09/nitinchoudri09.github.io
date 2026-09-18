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
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('nav-active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            document.body.style.overflow = '';
        });
    });

    // Close menu on resize if switching to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            document.body.style.overflow = '';
        }
    });

    // Sticky Navbar & Scroll Progress
    const progressBarr = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        // Navbar
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBarr) progressBarr.style.width = scrolled + "%";
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY || window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPos >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(li => {
            const link = li.querySelector('a');
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    /* -----------------------------------------------
       2. Typing Text Effect
    ----------------------------------------------- */
    const typingText = document.querySelector('.typing-text');
    const words = ["Python Developer","Full Stack Developer", "AI Engineer", "QA Testing Engineer"];
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
    setTimeout(type, 1500);

    /* -----------------------------------------------
       2.5 Preloader Handling — Animated 0% to 100%
    ----------------------------------------------- */

    // --- Particle System ---
    (function initParticles() {
        const canvas = document.getElementById('loader-particles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.6,
                speedY: (Math.random() - 0.5) * 0.6,
                opacity: Math.random() * 0.5 + 0.1,
                pulse: Math.random() * Math.PI * 2,
                color: Math.random() > 0.5
                    ? `rgba(168, 85, 247, OPACITY)`
                    : `rgba(0, 210, 255, OPACITY)`
            };
        }

        for (let i = 0; i < 60; i++) {
            particles.push(createParticle());
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                p.pulse += 0.02;

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                const flicker = Math.sin(p.pulse) * 0.2 + 0.8;
                const alpha = p.opacity * flicker;
                const color = p.color.replace('OPACITY', alpha.toFixed(2));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = color;
                ctx.fill();
            });

            // Draw faint connection lines between close particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${(1 - dist / 120) * 0.12})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(drawParticles);
        }
        drawParticles();

        // Expose cleanup for after preloader hides
        window._stopLoaderParticles = () => {
            cancelAnimationFrame(animId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    })();

    // --- Percentage Counter + Glow ---
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        const percentEl = document.getElementById('loader-percentage');
        const progressBar = document.getElementById('loader-progress-bar');
        const glowRing = document.getElementById('loader-glow-ring');
        const orbits = document.querySelectorAll('.loader-orbit');
        let current = 0;
        const target = 100;
        const totalDuration = 2800;
        const steps = target;
        let step = 0;

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function tick() {
            step++;
            const progress = Math.min(step / steps, 1);
            const easedProgress = easeOutCubic(progress);
            current = Math.round(easedProgress * target);

            percentEl.textContent = current;
            progressBar.style.width = current + '%';

            // Intensify glow ring as percentage increases
            if (glowRing) {
                const glowIntensity = current / 100;
                const glowSize = 30 + glowIntensity * 40;
                const glowSpread = 60 + glowIntensity * 60;
                glowRing.style.boxShadow = `0 0 ${glowSize}px rgba(168, 85, 247, ${0.2 + glowIntensity * 0.4}), 0 0 ${glowSpread}px rgba(168, 85, 247, ${0.1 + glowIntensity * 0.2})`;
            }

            // Speed up orbits as we approach 100
            orbits.forEach((orbit, i) => {
                const speedMultiplier = 1 + (current / 100) * 1.5;
                const baseDuration = [3, 2.5, 2][i] || 2;
                orbit.style.animationDuration = (baseDuration / speedMultiplier) + 's';
            });

            if (current < target) {
                const delay = totalDuration / steps;
                setTimeout(tick, delay);
            } else {
                // Hit 100% — flash glow, then reveal
                if (glowRing) {
                    glowRing.style.boxShadow = '0 0 80px rgba(168, 85, 247, 0.8), 0 0 150px rgba(0, 210, 255, 0.4)';
                    glowRing.style.transform = 'scale(1.6)';
                }

                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    document.body.classList.add('loaded');

                    // Stop particles after transition
                    if (window._stopLoaderParticles) {
                        setTimeout(window._stopLoaderParticles, 1300);
                    }

                    setTimeout(() => {
                        document.querySelector('.hero').classList.add('active');
                    }, 400);
                }, 500);
            }
        }

        // Small initial delay before the count begins
        setTimeout(tick, 300);
    });


    /* -----------------------------------------------
       3. Custom Cursor Logic
    ----------------------------------------------- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item, .experience-card, .cert-card, .hamburger');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Use requestAnimationFrame for smoother performance
        requestAnimationFrame(() => {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Animate outline with a slight delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    /* -----------------------------------------------
       4. Magnetic Button Effect
    ----------------------------------------------- */
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-resume-animated, .logo');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    /* -----------------------------------------------
       5. Enhanced Scroll Animations (Staggered)
    ----------------------------------------------- */
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a category or wrapper, handle children stagger
                if (entry.target.classList.contains('skills-wrapper') ||
                    entry.target.classList.contains('experience-timeline') ||
                    entry.target.classList.contains('projects-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('active');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Common reveal classes in CSS (will add below in CSS)
    document.querySelectorAll('[data-aos], .project-card, .skill-category, .experience-item, .cert-card').forEach(el => {
        el.classList.add('scroll-reveal');
        scrollObserver.observe(el);
    });




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
            color: 0xa855f7, // Electric Purple
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // 2. Central Nebula / Glowing Ring
        const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.3 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        scene.add(ring);

        // Secondary inner glowing ring
        const ringGeo2 = new THREE.TorusGeometry(1.4, 0.01, 16, 100);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.2 });
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

        // Hero Image Parallax (Extra Depth) - Only on Desktop
        const heroImg = document.querySelector('.img-wrapper');
        if (heroImg && window.innerWidth > 1024) {
            window.addEventListener('mousemove', (e) => {
                const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
                const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
                heroImg.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
            });
        }
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

    /* -----------------------------------------------
       9. Dynamic Card Glow Tracking
    ----------------------------------------------- */
    const glowCards = document.querySelectorAll('.glass-card, .project-card, .skill-category, .experience-card, .cert-card');

    glowCards.forEach(card => {
        // Inject glow element if not present
        if (!card.querySelector('.card-glow')) {
            const glow = document.createElement('div');
            glow.classList.add('card-glow');
            card.appendChild(glow);
        }

        card.addEventListener('mousemove', (e) => {
            const glow = card.querySelector('.card-glow');
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        });
    });

    /* -----------------------------------------------
       10. Social Icon Micro-animations
    ----------------------------------------------- */
    const socialIcons = document.querySelectorAll('.social-icons a');
    socialIcons.forEach((icon, index) => {
        icon.style.opacity = '0';
        icon.style.transform = 'translateY(20px)';

        // Appear with stagger when footer visible
        const footerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(() => {
                    icon.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    icon.style.opacity = '1';
                    icon.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
        footerObserver.observe(document.querySelector('.footer'));
    });

});
