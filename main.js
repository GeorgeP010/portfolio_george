// Ultimate Portfolio - Spectaculaire Upgrade
// George Pelealuw - 2025

document.addEventListener('DOMContentLoaded', function () {



    // ========== DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 500);
    });

    // ========== LENIS SMOOTH SCROLL (Dennis Snellenberg Style) ==========
    let lenis = null;
    function initLenis() {
        if (typeof Lenis === 'undefined') return;

        lenis = new Lenis({
            duration: 1.25,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Dennis Snellenberg exponential curve
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            infinite: false
        });

        window.lenis = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Smooth scroll for anchor links & scroll indicator
        document.querySelectorAll('a[href^="#"], .scroll-indicator').forEach(el => {
            el.addEventListener('click', (e) => {
                let targetId = el.getAttribute('href');
                if (el.classList.contains('scroll-indicator') || !targetId) {
                    targetId = '#work';
                }
                if (targetId && targetId !== '#') {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        lenis.scrollTo(targetEl, { offset: -60, duration: 1.4 });
                    }
                }
            });
        });
    }

    if (typeof Lenis !== 'undefined') {
        initLenis();
    } else {
        window.addEventListener('load', initLenis);
    }

    // ========== PHYSICS TAGS EFFECT ==========
    const physicsContainer = document.getElementById('physicsContainer');

    function showStaticTags() {
        if (!physicsContainer) return;

        const tags = [
            { text: 'UI/UX', dark: false },
            { text: 'DEVELOPER', dark: true },
            { text: 'DESIGNER', dark: false },
            { text: 'TESTER', dark: true },
            { text: 'CREATIVE', dark: false },
            { text: 'ROTTERDAM', dark: false },
            { text: 'GEORGE', dark: true }
        ];

        tags.forEach((tag, index) => {
            const tagElement = document.createElement('div');
            tagElement.className = `physics-tag ${tag.dark ? 'dark' : ''}`;
            tagElement.textContent = tag.text;
            tagElement.style.position = 'absolute';
            tagElement.style.top = `${20 + index * 60}px`;
            tagElement.style.left = `${Math.random() * 80 + 10}%`;
            tagElement.style.opacity = '0';
            tagElement.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            physicsContainer.appendChild(tagElement);
        });
    }

    function initPhysicsEngine() {
        try {
            if (!physicsContainer || typeof Matter === 'undefined') {
                console.warn('Physics engine not available, using fallback');
                showStaticTags();
                return;
            }

            const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter;

            const containerRect = physicsContainer.getBoundingClientRect();
            const width = containerRect.width;
            const height = containerRect.height;

            const engine = Engine.create();
            engine.world.gravity.y = 0.3;

            const render = Render.create({
                element: physicsContainer,
                engine: engine,
                options: {
                    width: width,
                    height: height,
                    background: 'transparent',
                    wireframes: false
                }
            });

            render.canvas.style.position = 'absolute';
            render.canvas.style.top = '0';
            render.canvas.style.left = '0';
            render.canvas.style.pointerEvents = 'none';
            render.canvas.style.opacity = '0';

            const boundaryOptions = {
                isStatic: true,
                render: { fillStyle: 'transparent' }
            };

            const floorY = height - 25;
            const floor = Bodies.rectangle(width / 2, floorY, width, 50, boundaryOptions);
            const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
            const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
            const ceiling = Bodies.rectangle(width / 2, -500, width, 50, boundaryOptions);

            // Create collision bodies for the name letters (stacked GEORGE and PELEALUW)
            const heroTitle = document.querySelector('.hero-title');
            const line1 = "GEORGE";
            const line2 = "PELEALUW";

            const wrapLetters = (text) => text.split('').map(char =>
                `<span class="title-letter" style="display:inline-block">${char}</span>`
            ).join('');

            heroTitle.innerHTML = `
                <div class="hero-title-row" style="display:block;">${wrapLetters(line1)}</div>
                <div class="hero-title-row" style="display:block;">${wrapLetters(line2)}</div>
            `;

            const letterBodies = [];
            const letters = heroTitle.querySelectorAll('.title-letter');

            letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const containerRect = physicsContainer.getBoundingClientRect();

                // Position the collision body so its top surface sits precisely 4px above the letter top.
                // This ensures tags rest cleanly on top of the letters without sinking into the ink.
                const letterTop = rect.top - containerRect.top;
                const letterHeight = rect.height;
                const visualX = rect.left - containerRect.left + rect.width / 2;
                const visualY = letterTop - 4 + letterHeight / 2;

                const body = Bodies.rectangle(visualX, visualY, rect.width, letterHeight, {
                    ...boundaryOptions,
                    restitution: 0.4,
                    friction: 0.25
                });

                letterBodies.push(body);
            });

            // Define tags
            const tags = [
                { text: 'UI/UX', dark: false },
                { text: 'DEVELOPER', dark: true },
                { text: 'DESIGNER', dark: false },
                { text: 'TESTER', dark: true },
                { text: 'CREATIVE', dark: false },
                { text: 'ROTTERDAM', dark: false },
                { text: 'GEORGE', dark: true }
            ];

            // Create tag bodies
            const tagBodies = tags.map((tag, index) => {
                const tagElement = document.createElement('div');
                tagElement.className = `physics-tag ${tag.dark ? 'dark' : ''}`;
                tagElement.textContent = tag.text;
                tagElement.style.opacity = '0';
                physicsContainer.appendChild(tagElement);

                const rect = tagElement.getBoundingClientRect();
                const tagWidth = rect.width || 120;
                const tagHeight = rect.height || 40;

                // Spawn tags distributed across the hero name from above
                const heroRect = heroTitle.getBoundingClientRect();
                const heroLeft = heroRect.left - containerRect.left;
                const heroWidth = heroRect.width;
                const spread = index / (tags.length - 1 || 1);

                const spawnX = Math.max(tagWidth / 2 + 10, Math.min(width - tagWidth / 2 - 10,
                    heroLeft + 30 + spread * (heroWidth - 60) + (Math.random() - 0.5) * 30
                ));
                const spawnY = -40 - (index * 55);

                const body = Bodies.rectangle(spawnX, spawnY, tagWidth, tagHeight, {
                    render: { fillStyle: 'transparent' },
                    restitution: 0.55,
                    frictionAir: 0.015,
                    friction: 0.2,
                    density: 0.001
                });

                Body.setVelocity(body, {
                    x: (Math.random() - 0.5) * 1.5,
                    y: 1.5 + Math.random() * 1.5
                });
                Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.04);

                setTimeout(() => {
                    tagElement.style.opacity = '1';
                    tagElement.style.transition = 'opacity 0.4s ease';
                }, index * 80);

                return { elem: tagElement, body: body };
            });

            // Create mouse constraint
            const mouse = Mouse.create(render.canvas);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: { visible: false }
                }
            });

            // Allow dragging through tag elements
            tagBodies.forEach(({ elem, body }) => {
                let isDragging = false;
                elem.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    Body.setStatic(body, true);
                    const onMouseMove = (moveEvent) => {
                        if (!isDragging) return;
                        const containerRect = physicsContainer.getBoundingClientRect();
                        const newX = moveEvent.clientX - containerRect.left;
                        const newY = moveEvent.clientY - containerRect.top;
                        Body.setPosition(body, { x: newX, y: newY });
                    };
                    const onMouseUp = () => {
                        if (isDragging) {
                            isDragging = false;
                            Body.setStatic(body, false);
                            Body.setVelocity(body, {
                                x: (Math.random() - 0.5) * 4,
                                y: -2
                            });
                        }
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('mouseup', onMouseUp);
                    };
                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                });
            });

            // Add all bodies to world
            World.add(engine.world, [
                floor,
                leftWall,
                rightWall,
                ceiling,
                ...letterBodies,
                mouseConstraint,
                ...tagBodies.map(tb => tb.body)
            ]);

            const runner = Runner.create();
            Runner.run(runner, engine);
            Render.run(render);

            // Pause physics during scroll for better performance
            let scrollTimeout;
            let isScrolling = false;

            window.addEventListener('scroll', () => {
                if (!isScrolling) {
                    isScrolling = true;
                    engine.enabled = false;
                }

                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    engine.enabled = true;
                }, 150);
            }, { passive: true });

            function updateTags() {
                tagBodies.forEach(({ body, elem }) => {
                    const { x, y } = body.position;
                    elem.style.left = `${x}px`;
                    elem.style.top = `${y}px`;
                    elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
                });
                requestAnimationFrame(updateTags);
            }
            updateTags();
        } catch (error) {
            console.error('Physics engine initialization failed:', error);
            showStaticTags();
        }
    }

    initPhysicsEngine();

    // ========== GSAP SCROLL ANIMATIONS ==========
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Dennis Snellenberg 120fps sync with Lenis
        if (window.lenis) {
            window.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                window.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        // Work cards staggered reveal & subtle Dennis Snellenberg image parallax
        const workCards = document.querySelectorAll('.work-card');
        workCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 80,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 50%',
                        toggleActions: 'play none none none'
                    },
                    delay: (index % 2) * 0.15 // Stagger within rows
                }
            );

            // Subtle Dennis Snellenberg scrubbed image parallax
            const img = card.querySelector('.work-card-image img');
            if (img) {
                gsap.fromTo(img,
                    { yPercent: -8 },
                    {
                        yPercent: 8,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );
            }
        });

        // Section titles slide in
        document.querySelectorAll('.section-title, .section-header h2').forEach(title => {
            gsap.fromTo(title,
                { opacity: 0, x: -40 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });

        // About section
        const aboutText = document.querySelector('.about-text');
        const aboutImage = document.querySelector('.about-image');

        if (aboutText) {
            gsap.fromTo(aboutText,
                { opacity: 0, x: -60 },
                {
                    opacity: 1, x: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: aboutText, start: 'top 80%' }
                }
            );
        }

        if (aboutImage) {
            gsap.fromTo(aboutImage,
                { opacity: 0, x: 60, scale: 0.9 },
                {
                    opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: aboutImage, start: 'top 80%' }
                }
            );
        }

        // Timeline items staggered
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            gsap.fromTo(item,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    delay: index * 0.15
                }
            );
        });

        // Timeline scroll-driven fill
        const timelineTrack = document.getElementById('timelineTrack');
        if (timelineTrack) {
            ScrollTrigger.create({
                trigger: timelineTrack,
                start: 'top 80%',
                end: 'bottom 40%',
                onUpdate: (self) => {
                    const progress = self.progress;
                    // Remove all fill classes
                    timelineTrack.classList.remove('fill-25', 'fill-50', 'fill-75', 'fill-100');

                    // Add items active-scroll class based on progress
                    timelineItems.forEach((item, index) => {
                        const threshold = (index + 1) / timelineItems.length;
                        if (progress >= threshold * 0.8) {
                            item.classList.add('active-scroll');
                        } else {
                            item.classList.remove('active-scroll');
                        }
                    });

                    // Fill the track line
                    if (progress > 0.8) timelineTrack.classList.add('fill-100');
                    else if (progress > 0.6) timelineTrack.classList.add('fill-75');
                    else if (progress > 0.35) timelineTrack.classList.add('fill-50');
                    else if (progress > 0.15) timelineTrack.classList.add('fill-25');
                }
            });
        }

        // Contact section
        const emailLink = document.querySelector('.email-link');
        if (emailLink) {
            gsap.fromTo(emailLink,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: emailLink, start: 'top 85%' }
                }
            );
        }

        // Intro section parallax
        const introSection = document.querySelector('.intro-section');
        if (introSection) {
            gsap.fromTo(introSection.querySelector('.intro-card-dark'),
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: { trigger: introSection, start: 'top 80%' }
                }
            );
        }
    }

    // Wait for GSAP to load
    function waitForGSAP() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            initScrollAnimations();
        } else {
            setTimeout(waitForGSAP, 100);
        }
    }
    waitForGSAP();

    // ========== PARALLAX SCROLL EFFECT & PROGRESS ==========
    const heroContainer = document.querySelector('.hero-container');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    function handleScrollUpdate(scrollY, maxScroll) {
        if (heroContainer && scrollY < window.innerHeight) {
            const rate = scrollY * 0.4;
            heroContainer.style.transform = `translateY(${rate}px)`;
            heroContainer.style.opacity = Math.max(0, 1 - (scrollY / window.innerHeight) * 0.9);
        }

        if (scrollIndicator) {
            scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 200);
        }

        if (progressBar && maxScroll > 0) {
            const scrolled = (scrollY / maxScroll) * 100;
            progressBar.style.width = scrolled + '%';
        }
    }

    if (window.lenis) {
        window.lenis.on('scroll', ({ scroll, limit }) => {
            handleScrollUpdate(scroll, limit);
        });
    } else {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const maxScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    handleScrollUpdate(window.pageYOffset, maxScroll);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========== WORK CARDS ENHANCED HOVER ==========
    document.querySelectorAll('.work-card').forEach(card => {
        const image = card.querySelector('.work-card-image img');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            if (image) {
                image.style.transform = `scale(1.08) translate(${x * 15}px, ${y * 15}px)`;
            }

            card.style.transform = `
                translateY(-8px) 
                perspective(1000px) 
                rotateX(${y * 2}deg) 
                rotateY(${x * 2}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
            card.style.transform = 'translateY(0)';
        });
    });

    // ========== MAGNETIC EFFECT ON BUTTONS (Dennis Snellenberg Signature) ==========
    const magneticElements = document.querySelectorAll(
        '.header-projects-pill, .theme-toggle-minimal, .email-link, .social-links a, .view-badge, .scroll-indicator'
    );

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            if (typeof gsap !== 'undefined') {
                gsap.to(el, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            } else {
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            }
        });

        el.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)'
                });
            } else {
                el.style.transform = 'translate(0, 0)';
            }
        });
    });



    // ========== CONSOLE MESSAGE ==========
    console.log('%c👋 Hey Developer!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%cLike what you see? Let\'s create something amazing together!', 'font-size: 14px; color: #737373;');
    console.log('%c✉️ gpelealuw@gmail.com', 'font-size: 12px; color: #0a0a0a; font-weight: bold;');
    console.log('%c🔗 https://github.com/GeorgeP010', 'font-size: 12px; color: #737373;');

});

// ========== RESIZE HANDLER ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 250);
});
