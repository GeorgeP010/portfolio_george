// Project Case Study - Interactive Engine
// George Pelealuw • Creative Developer & Designer

document.addEventListener('DOMContentLoaded', () => {

    // ========== DARK / LIGHT THEME TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
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
    }

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

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(el => {
            el.addEventListener('click', (e) => {
                const targetId = el.getAttribute('href');
                if (targetId && targetId !== '#') {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        lenis.scrollTo(targetEl, { offset: -80, duration: 1.2 });
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

    // ========== GSAP SCROLL ANIMATIONS & PARALLAX ==========
    function initAnimations() {
        if (typeof gsap === 'undefined') return;

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            if (window.lenis) {
                window.lenis.on('scroll', ScrollTrigger.update);
            }

            // Image scrubbed parallax effect
            const mockupImg = document.querySelector('.project-mockup-window img, .project-image-simple img');
            if (mockupImg) {
                gsap.fromTo(mockupImg,
                    { yPercent: -4, scale: 1.03 },
                    {
                        yPercent: 4,
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: mockupImg.parentElement,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );
            }

            // Stagger reveal on content blocks
            const blocks = document.querySelectorAll('.content-block-simple');
            if (blocks.length > 0) {
                blocks.forEach((block, idx) => {
                    gsap.fromTo(block,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: block,
                                start: 'top 85%',
                                toggleActions: 'play none none none'
                            },
                            delay: (idx % 2) * 0.15
                        }
                    );
                });
            }

            // Stagger reveal on info grid blocks
            const infoBlocks = document.querySelectorAll('.info-block-simple');
            if (infoBlocks.length > 0) {
                gsap.fromTo(infoBlocks,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: '.project-info-simple',
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        }

        // Hero entrance animation (with guards)
        if (document.querySelector('.project-kicker')) {
            gsap.fromTo('.project-kicker',
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
            );
        }
        if (document.querySelector('.project-title-simple')) {
            gsap.fromTo('.project-title-simple',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
            );
        }
        const heroBottom = document.querySelector('.project-hero-bottom') || document.querySelector('.project-intro-simple');
        if (heroBottom) {
            gsap.fromTo(heroBottom,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.35 }
            );
        }
        const showcaseTarget = document.querySelector('.project-mockup-window') || document.querySelector('.project-image-simple');
        if (showcaseTarget) {
            gsap.fromTo(showcaseTarget,
                { opacity: 0, y: 50, scale: 0.98 },
                { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out', delay: 0.45 }
            );
        }
    }

    if (typeof gsap !== 'undefined') {
        initAnimations();
    } else {
        window.addEventListener('load', initAnimations);
    }

    // ========== MAGNETIC BUTTONS (Dennis Snellenberg Style) ==========
    const magneticElements = document.querySelectorAll('.back-link, .btn-live-project, .next-link-simple, .next-arrow-circle, .header-live-pill');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            if (typeof gsap !== 'undefined') {
                gsap.to(el, {
                    x: x * 0.3,
                    y: y * 0.3,
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

});
