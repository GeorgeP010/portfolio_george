/**
 * George Pelealuw • Unified Creative Portfolio & 3D Studio
 * Inspired by Mild Sugar Design (mildsugardesign.jp) & George Pelealuw Identity
 * 2026
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. THEME TOGGLE (DARK / LIGHT MODE)
    // =========================================================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            themeToggle.style.transform = 'rotate(360deg) scale(1.15)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 400);
        });
    }

    // =========================================================================
    // 2. 3D VIDEO AVATAR STUDIO (MILD SUGAR INTERACTION)
    // =========================================================================
    const studioViewport = document.getElementById('studioViewport');
    const studioStage = document.getElementById('studioStage');
    const rotatingBadge = document.getElementById('rotatingBadge');
    const avatarClickZone = document.getElementById('avatarClickZone');
    const sidePanel = document.getElementById('sidePanel');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const drawerToCasesBtn = document.getElementById('drawerToCasesBtn');
    const cursorStalker = document.getElementById('cursorStalker');
    const stalkerText = cursorStalker ? cursorStalker.querySelector('span') : null;

    const videoWorking = document.getElementById('videoWorking');
    const videoWaving = document.getElementById('videoWaving');

    let isFrontActive = false;
    let audioCtx = null;

    // Preload & warm up both videos immediately
    if (videoWorking) {
        videoWorking.play().catch(() => {});
    }
    if (videoWaving) {
        videoWaving.play().then(() => {
            if (!isFrontActive) {
                // Kept warm in background with opacity 0
            }
        }).catch(() => {});
    }

    // Audio Synthesizer (Gentle Marimba Chime)
    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playChime(type = 'open') {
        try {
            initAudio();
            if (!audioCtx) return;

            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'open') {
                // Two-tone rising chime (E5 -> B5)
                osc.frequency.setValueAtTime(659.25, now);
                osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
                osc.start(now);
                osc.stop(now + 0.55);
            } else {
                // Soft falling dismiss chime (A5 -> C5)
                osc.frequency.setValueAtTime(880.0, now);
                osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch (e) {
            // Audio autoplay policy fallback
        }
    }

    function showFrontState() {
        if (isFrontActive) return;
        isFrontActive = true;

        playChime('open');

        // Instant crossfade to waving video
        if (videoWaving) {
            videoWaving.play().catch(() => {});
            videoWaving.classList.add('active');
        }
        if (videoWorking) {
            videoWorking.classList.remove('active');
        }

        if (studioStage) studioStage.classList.add('front-active');
        if (studioViewport) studioViewport.classList.add('panel-open');
        if (sidePanel) {
            sidePanel.classList.add('open');
            sidePanel.setAttribute('aria-hidden', 'false');
        }

        if (stalkerText) stalkerText.textContent = 'Sluit ✕';
    }

    function showBackState() {
        if (!isFrontActive) return;
        isFrontActive = false;

        playChime('close');

        // Instant crossfade back to coding video
        if (videoWorking) {
            videoWorking.play().catch(() => {});
            videoWorking.classList.add('active');
        }
        if (videoWaving) {
            videoWaving.classList.remove('active');
        }

        if (studioStage) studioStage.classList.remove('front-active');
        if (studioViewport) studioViewport.classList.remove('panel-open');
        if (sidePanel) {
            sidePanel.classList.remove('open');
            sidePanel.setAttribute('aria-hidden', 'true');
        }

        if (stalkerText) stalkerText.textContent = 'Hey! 🤝';
    }

    if (avatarClickZone) {
        avatarClickZone.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isFrontActive) {
                showFrontState();
            } else {
                showBackState();
            }
        });
    }

    if (rotatingBadge) {
        rotatingBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            showFrontState();
        });
    }

    if (studioStage) {
        studioStage.addEventListener('click', (e) => {
            if (!isFrontActive) {
                showFrontState();
            } else {
                showBackState();
            }
        });

        studioStage.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isFrontActive) showBackState();
                else showFrontState();
            }
        });
    }

    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showBackState();
        });
    }

    // Drawer button: "Bekijk mijn Projecten (11)"
    if (drawerToCasesBtn) {
        drawerToCasesBtn.addEventListener('click', () => {
            showBackState();
        });
    }

    // Escape key closes side panel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFrontActive) {
            showBackState();
        }
    });

    // =========================================================================
    // 3. CURSOR STALKER FOLLOWER
    // =========================================================================
    if (cursorStalker && stalkerText) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let currentX = mouseX;
        let currentY = mouseY;
        let isCursorMoving = false;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isCursorMoving) {
                isCursorMoving = true;
                cursorStalker.classList.add('visible');
            }
        });

        window.addEventListener('mouseleave', () => {
            cursorStalker.classList.remove('visible');
        });

        function animateStalker() {
            const ease = 0.18;
            currentX += (mouseX - currentX) * ease;
            currentY += (mouseY - currentY) * ease;

            cursorStalker.style.transform = `translate3d(${currentX + 16}px, ${currentY + 16}px, 0)`;
            requestAnimationFrame(animateStalker);
        }
        requestAnimationFrame(animateStalker);

        if (avatarClickZone) {
            avatarClickZone.addEventListener('mouseenter', () => {
                cursorStalker.classList.add('hovering-avatar');
                stalkerText.textContent = isFrontActive ? 'Draai terug ↺' : 'Klik op mij! 👋';
            });

            avatarClickZone.addEventListener('mouseleave', () => {
                cursorStalker.classList.remove('hovering-avatar');
                stalkerText.textContent = isFrontActive ? 'Sluit ✕' : 'Hey! 🤝';
            });
        }

        if (sidePanel) {
            sidePanel.addEventListener('mouseenter', () => {
                cursorStalker.classList.remove('visible');
            });
            sidePanel.addEventListener('mouseleave', () => {
                if (isCursorMoving) cursorStalker.classList.add('visible');
            });
        }
    }

    // =========================================================================
    // 4. CASES FILTER TABS (ALLE / WEB DEV / MOBILE / DESIGN)
    // =========================================================================
    const filterBtns = document.querySelectorAll('.cases-filter-btn');
    const projectCards = document.querySelectorAll('.creative-project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter cards with smooth fade
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filter === 'all' || cardCategory === filter) {
                        card.classList.remove('is-hidden');
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            });
        });
    }

    // =========================================================================
    // 5. SCROLLSPY NAVIGATION
    // =========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header-nav .nav-link');

    function onScrollSpy() {
        const scrollPosition = window.scrollY + 180;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', onScrollSpy, { passive: true });
    onScrollSpy(); // Initial check

    // =========================================================================
    // 6. SMOOTH SCROLLING FOR INTERNAL ANCHORS
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
