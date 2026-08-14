// Ultimate Portfolio - Production Ready
// George Pelealuw - 2025

document.addEventListener('DOMContentLoaded', function () {

    // ========== DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Add a subtle animation to the button
        themeToggle.style.transform = 'rotate(360deg) scale(1.1)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });

    // ========== PHYSICS TAGS EFFECT ==========
    const physicsContainer = document.getElementById('physicsContainer');

    // Fallback function for static tags if physics fails
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

    // Initialize physics with error handling
    function initPhysicsEngine() {
        try {
            if (!physicsContainer || typeof Matter === 'undefined') {
                console.warn('Physics engine not available, using fallback');
                showStaticTags();
                return;
            }

            const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter;

            // Container dimensions
            const containerRect = physicsContainer.getBoundingClientRect();
            const width = containerRect.width;
            const height = containerRect.height;

            // Create engine
            const engine = Engine.create();
            engine.world.gravity.y = 0.3;

            // Create renderer (invisible)
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

            // Hide the canvas
            render.canvas.style.position = 'absolute';
            render.canvas.style.top = '0';
            render.canvas.style.left = '0';
            render.canvas.style.pointerEvents = 'none';
            render.canvas.style.opacity = '0';

            // Create boundaries
            const boundaryOptions = {
                isStatic: true,
                render: { fillStyle: 'transparent' }
            };

            const floorY = height - 25;
            const floor = Bodies.rectangle(width / 2, floorY, width, 50, boundaryOptions);
            const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
            const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);
            const ceiling = Bodies.rectangle(width / 2, -500, width, 50, boundaryOptions);

            // Create collision bodies for the name letters
            const heroTitle = document.querySelector('.hero-title');
            const line1 = "GEORGE";
            const line2 = "PELEALUW";

            const wrapLetters = (text) => text.split('').map(char =>
                `<span class="title-letter" style="display:inline-block">${char}</span>`
            ).join('');

            heroTitle.innerHTML = `
                <div style="display:block;">${wrapLetters(line1)}</div>
                <div style="display:block;">${wrapLetters(line2)}</div>
            `;

            const letterBodies = [];
            const letters = heroTitle.querySelectorAll('.title-letter');

            letters.forEach(letter => {
                const rect = letter.getBoundingClientRect();
                const containerRect = physicsContainer.getBoundingClientRect();

                const x = rect.left - containerRect.left + rect.width / 2;
                const y = rect.top - containerRect.top + rect.height / 2;

                const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                    ...boundaryOptions,
                    restitution: 0.6,
                    chamfer: { radius: 10 }
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
                const tagWidth = rect.width;
                const tagHeight = rect.height;

                const x = Math.random() * (width - tagWidth) + tagWidth / 2;
                const y = Math.random() * 200 - 300;

                const body = Bodies.rectangle(x, y, tagWidth, tagHeight, {
                    render: { fillStyle: 'transparent' },
                    restitution: 0.6,
                    frictionAir: 0.01,
                    friction: 0.1,
                    density: 0.001
                });

                Body.setVelocity(body, {
                    x: (Math.random() - 0.5) * 3,
                    y: (Math.random() - 0.5) * 2
                });
                Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.03);

                setTimeout(() => {
                    tagElement.style.opacity = '1';
                    tagElement.style.transition = 'opacity 0.5s ease';
                }, index * 100);

                return { elem: tagElement, body: body };
            });

            // Create mouse constraint
            const mouse = Mouse.create(physicsContainer);
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: { visible: false }
                }
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

            // Run engine
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

            // Update loop to sync DOM with physics
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

    // Call the physics initialization
    initPhysicsEngine();

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    // Add scroll-reveal class to elements
    document.querySelectorAll('.work-card').forEach((item, index) => {
        item.classList.add('scroll-reveal');
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.classList.add('scroll-reveal');
        item.style.transitionDelay = `${index * 0.12}s`;
        observer.observe(item);
    });

    // ========== PARALLAX SCROLL EFFECT (THROTTLED) ==========
    const heroContainer = document.querySelector('.hero-container');
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;

        // Hero parallax
        if (heroContainer && scrolled < window.innerHeight) {
            const rate = scrolled * 0.5;
            heroContainer.style.transform = `translateY(${rate}px)`;
            heroContainer.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        }

        // Work cards parallax
        document.querySelectorAll('.work-card').forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;

            if (scrollProgress > 0 && scrollProgress < 1.5) {
                const offset = index % 2 === 0 ? 1 : -1;
                const parallax = (scrollProgress - 0.5) * 20 * offset;

                if (!card.matches(':hover')) {
                    card.style.transform = `translateY(${parallax}px)`;
                }
            }
        });

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

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px)';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            if (image) {
                image.style.transform = `scale(1.1) translate(${x * 20}px, ${y * 20}px)`;
            }

            card.style.transform = `
                translateY(-12px) 
                perspective(1000px) 
                rotateX(${y * 3}deg) 
                rotateY(${x * 3}deg)
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
    const magneticElements = document.querySelectorAll('.see-more-link, .email-link');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ========== TIMELINE HOVER EFFECTS ==========
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========== SCROLL PROGRESS INDICATOR ==========
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #0a0a0a, #737373);
        width: 0%;
        z-index: 10001;
        transition: width 0.1s ease;
    `;
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

    // ========== PAGE LOAD ANIMATION ==========
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';

        setTimeout(() => {
            document.body.style.transition = 'opacity 0.8s ease';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ========== CURSOR TRAIL EFFECT (DESKTOP ONLY) ==========
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: #0a0a0a;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
            transition: transform 0.15s ease;
        `;
        cursor.setAttribute('aria-hidden', 'true');
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.2;
            cursorY += dy * 0.2;

            cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Scale on hover
        document.querySelectorAll('a, button, .work-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '16px';
                cursor.style.height = '16px';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
            });
        });
    }

    // ========== CONSOLE MESSAGE ==========
    console.log('%c👋 Hey Developer!', 'font-size: 24px; font-weight: bold; color: #0a0a0a;');
    console.log('%cLike what you see? Let\'s create something amazing together!', 'font-size: 14px; color: #737373;');
    console.log('%c✉️ gpelealuw@gmail.com', 'font-size: 12px; color: #0a0a0a; font-weight: bold;');
    console.log('%c🔗 https://github.com/GeorgeP010', 'font-size: 12px; color: #737373;');

});

// ========== PROJECT PAGES ==========
// Work cards now link to dedicated case study pages in /projects/ folder
// No modal code needed - better for SEO and user experience

// ========== RESIZE HANDLER ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 250);
});
