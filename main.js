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

                // Space Grotesk uppercase letters have ~18% ascent whitespace at the top of the em-box.
                // We offset down so the physics body's top surface aligns PRECISELY with the visible black ink of each letter.
                // This eliminates the "invisible wall" floating above the name!
                const capOffsetTop = rect.height * 0.18;
                const capHeight = rect.height * 0.72;
                const visualY = rect.top - containerRect.top + capOffsetTop + capHeight / 2;
                const visualX = rect.left - containerRect.left + rect.width / 2;

                const body = Bodies.rectangle(visualX, visualY, rect.width * 0.96, capHeight, {
                    ...boundaryOptions,
                    restitution: 0.5,
                    friction: 0.15,
                    chamfer: { radius: 8 }
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
                const tagWidth = rect.width || 80;
                const tagHeight = rect.height || 28;

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

        // Work cards staggered reveal
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

    // ========== PARALLAX SCROLL EFFECT ==========
    const heroContainer = document.querySelector('.hero-container');
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;

        if (heroContainer && scrolled < window.innerHeight) {
            const rate = scrolled * 0.4;
            heroContainer.style.transform = `translateY(${rate}px)`;
            heroContainer.style.opacity = 1 - (scrolled / window.innerHeight) * 0.9;
        }

        // Hide scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.style.opacity = Math.max(0, 1 - scrolled / 200);
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });

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

    // ========== MAGNETIC EFFECT ON BUTTONS ==========
    const magneticElements = document.querySelectorAll('.email-link, .social-links a');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ========== SCROLL PROGRESS BAR ==========
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progressBar);

    let progressTicking = false;
    window.addEventListener('scroll', () => {
        if (!progressTicking) {
            window.requestAnimationFrame(() => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.pageYOffset / windowHeight) * 100;
                progressBar.style.width = scrolled + '%';
                progressTicking = false;
            });
            progressTicking = true;
        }
    }, { passive: true });



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
