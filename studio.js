/**
 * George Pelealuw — 3D Video Avatar Studio Experience
 * Inspired by Mild Sugar Design (mildsugardesign.jp)
 * Direct, instant 60fps MP4 video transitions without any still image flashes.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const studioViewport = document.getElementById('studioViewport');
    const studioStage = document.getElementById('studioStage');
    const rotatingBadge = document.getElementById('rotatingBadge');
    const avatarClickZone = document.getElementById('avatarClickZone');
    const sidePanel = document.getElementById('sidePanel');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const cursorStalker = document.getElementById('cursorStalker');
    const stalkerText = cursorStalker ? cursorStalker.querySelector('span') : null;

    // Real MP4 Video Elements
    const videoWorking = document.getElementById('videoWorking');
    const videoWaving = document.getElementById('videoWaving');

    let isFrontActive = false;
    let audioCtx = null;

    // ========== THEME TOGGLE (PORTFOLIO INTEGRATION) ==========
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

    // Ensure both videos are primed and preloaded
    if (videoWorking) {
        videoWorking.play().catch(() => {});
    }
    if (videoWaving) {
        // Warm up waving video so it can play instantly on click
        videoWaving.play().then(() => {
            if (!isFrontActive) {
                // Keep playing or ready in background
            }
        }).catch(() => {});
    }

    // -------------------------------------------------------------------------
    // 1. Subtle Web Audio Synthesizer (Chime Effects)
    // -------------------------------------------------------------------------
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
                // Bright welcoming two-tone marimba chime (E5 -> B5)
                osc.frequency.setValueAtTime(659.25, now);
                osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.12);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
                osc.start(now);
                osc.stop(now + 0.55);
            } else {
                // Soft dismiss note (A5 -> C5)
                osc.frequency.setValueAtTime(880.0, now);
                osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15);
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch (e) {
            // Audio policy fails silently
        }
    }

    // -------------------------------------------------------------------------
    // 2. Direct Instant Video Transition (Working <-> Waving)
    // -------------------------------------------------------------------------
    function showFrontState() {
        if (isFrontActive) return;
        isFrontActive = true;

        playChime('open');

        // Immediately start and show waving video
        if (videoWaving) {
            videoWaving.play().catch(() => {});
            videoWaving.classList.add('active');
        }
        if (videoWorking) {
            videoWorking.classList.remove('active');
        }

        // Studio stage & viewport state
        studioStage.classList.add('front-active');
        studioViewport.classList.add('panel-open');
        sidePanel.classList.add('open');
        sidePanel.setAttribute('aria-hidden', 'false');

        if (stalkerText) {
            stalkerText.textContent = 'Sluit ✕';
        }
    }

    function showBackState() {
        if (!isFrontActive) return;
        isFrontActive = false;

        playChime('close');

        // Immediately switch back to working video
        if (videoWorking) {
            videoWorking.play().catch(() => {});
            videoWorking.classList.add('active');
        }
        if (videoWaving) {
            videoWaving.classList.remove('active');
        }

        // Close drawer and restore stage framing
        studioStage.classList.remove('front-active');
        studioViewport.classList.remove('panel-open');
        sidePanel.classList.remove('open');
        sidePanel.setAttribute('aria-hidden', 'true');

        if (stalkerText) {
            stalkerText.textContent = 'Hey! 🤝';
        }
    }

    // Trigger on clicking stage or hotspot
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

        // Accessibility keyboard support
        studioStage.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isFrontActive) {
                    showBackState();
                } else {
                    showFrontState();
                }
            }
        });
    }

    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showBackState();
        });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFrontActive) {
            showBackState();
        }
    });

    // -------------------------------------------------------------------------
    // 3. Smooth Mouse Stalker Follower
    // -------------------------------------------------------------------------
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
});
