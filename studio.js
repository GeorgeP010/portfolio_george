/**
 * George Pelealuw — 3D Video Avatar Studio Experience
 * Inspired by Mild Sugar Design (mildsugardesign.jp)
 * Supports real MP4 video playback with seamless WebP motion fallback.
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
    const videoTurnFront = document.getElementById('videoTurnFront');
    const videoWaving = document.getElementById('videoWaving');
    const videoTurnBack = document.getElementById('videoTurnBack');

    // WebP Motion Fallback Elements
    const mediaWorking = document.getElementById('mediaWorking');
    const mediaTurnFront = document.getElementById('mediaTurnFront');
    const mediaWaving = document.getElementById('mediaWaving');
    const mediaTurnBack = document.getElementById('mediaTurnBack');

    let isFrontActive = false;
    let isTransitioning = false;
    let transitionTimer = null;
    let audioCtx = null;

    let hasWorkingVideo = false;
    let hasWavingVideo = false;
    let hasTurnVideo = false;

    // Helper to activate a single media layer
    function setMediaActive(targetMedia) {
        const allMedia = [
            videoWorking, videoTurnFront, videoWaving, videoTurnBack,
            mediaWorking, mediaTurnFront, mediaWaving, mediaTurnBack
        ];
        allMedia.forEach(el => {
            if (el) {
                if (el === targetMedia) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });
    }

    // Detect available MP4 videos
    if (videoWorking) {
        videoWorking.addEventListener('canplay', () => {
            hasWorkingVideo = true;
            if (!isFrontActive && !isTransitioning) {
                setMediaActive(videoWorking);
                videoWorking.play().catch(() => {});
            }
        });
        // Try initial play
        videoWorking.play().then(() => {
            hasWorkingVideo = true;
            if (!isFrontActive && !isTransitioning) {
                setMediaActive(videoWorking);
            }
        }).catch(() => {});
    }

    if (videoWaving) {
        videoWaving.addEventListener('canplay', () => {
            hasWavingVideo = true;
            if (isFrontActive && !isTransitioning) {
                setMediaActive(videoWaving);
                videoWaving.play().catch(() => {});
            }
        });
    }

    if (videoTurnFront) {
        videoTurnFront.addEventListener('canplay', () => {
            hasTurnVideo = true;
        });
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
    // 2. State Toggle: Working -> Swivel Turn -> Waving Greeting
    // -------------------------------------------------------------------------
    function showFrontState() {
        if (isFrontActive || isTransitioning) return;
        isFrontActive = true;
        isTransitioning = true;
        clearTimeout(transitionTimer);

        playChime('open');

        // Studio stage & viewport state
        studioStage.classList.add('front-active');
        studioViewport.classList.add('panel-open');
        sidePanel.classList.add('open');
        sidePanel.setAttribute('aria-hidden', 'false');

        if (stalkerText) {
            stalkerText.textContent = 'Sluit ✕';
        }

        if (hasTurnVideo && videoTurnFront) {
            // Play MP4 turn video
            setMediaActive(videoTurnFront);
            videoTurnFront.currentTime = 0;
            videoTurnFront.play().catch(() => {});

            videoTurnFront.onended = () => {
                if (isFrontActive) {
                    if (hasWavingVideo && videoWaving) {
                        setMediaActive(videoWaving);
                        videoWaving.currentTime = 0;
                        videoWaving.play().catch(() => {});
                    } else {
                        setMediaActive(mediaWaving);
                    }
                }
                isTransitioning = false;
            };

            transitionTimer = setTimeout(() => {
                if (isFrontActive && isTransitioning) {
                    if (hasWavingVideo && videoWaving) {
                        setMediaActive(videoWaving);
                        videoWaving.play().catch(() => {});
                    } else {
                        setMediaActive(mediaWaving);
                    }
                    isTransitioning = false;
                }
            }, 800);
        } else {
            // Play WebP turn animation
            if (mediaTurnFront) {
                const rawSrc = mediaTurnFront.getAttribute('src').split('?')[0];
                mediaTurnFront.src = rawSrc + '?t=' + Date.now();
                setMediaActive(mediaTurnFront);
            }

            // After turn finishes (~550ms), seamlessly show waving video or loop
            transitionTimer = setTimeout(() => {
                if (isFrontActive) {
                    if (hasWavingVideo && videoWaving) {
                        setMediaActive(videoWaving);
                        videoWaving.currentTime = 0;
                        videoWaving.play().catch(() => {});
                    } else {
                        setMediaActive(mediaWaving);
                    }
                }
                isTransitioning = false;
            }, 550);
        }
    }

    function showBackState() {
        if (!isFrontActive || isTransitioning) return;
        isFrontActive = false;
        isTransitioning = true;
        clearTimeout(transitionTimer);

        playChime('close');

        // Close drawer and restore stage framing
        studioStage.classList.remove('front-active');
        studioViewport.classList.remove('panel-open');
        sidePanel.classList.remove('open');
        sidePanel.setAttribute('aria-hidden', 'true');

        if (stalkerText) {
            stalkerText.textContent = 'Hey! 🤝';
        }

        if (hasTurnVideo && videoTurnBack) {
            // Play MP4 turn back video
            setMediaActive(videoTurnBack);
            videoTurnBack.currentTime = 0;
            videoTurnBack.play().catch(() => {});

            videoTurnBack.onended = () => {
                if (!isFrontActive) {
                    if (hasWorkingVideo && videoWorking) {
                        setMediaActive(videoWorking);
                        videoWorking.currentTime = 0;
                        videoWorking.play().catch(() => {});
                    } else {
                        setMediaActive(mediaWorking);
                    }
                }
                isTransitioning = false;
            };

            transitionTimer = setTimeout(() => {
                if (!isFrontActive && isTransitioning) {
                    if (hasWorkingVideo && videoWorking) {
                        setMediaActive(videoWorking);
                        videoWorking.play().catch(() => {});
                    } else {
                        setMediaActive(mediaWorking);
                    }
                    isTransitioning = false;
                }
            }, 800);
        } else {
            // Play WebP turn back animation
            if (mediaTurnBack) {
                const rawSrc = mediaTurnBack.getAttribute('src').split('?')[0];
                mediaTurnBack.src = rawSrc + '?t=' + Date.now();
                setMediaActive(mediaTurnBack);
            }

            // After turn back finishes (~550ms), seamlessly resume coding video or loop
            transitionTimer = setTimeout(() => {
                if (!isFrontActive) {
                    if (hasWorkingVideo && videoWorking) {
                        setMediaActive(videoWorking);
                        videoWorking.currentTime = 0;
                        videoWorking.play().catch(() => {});
                    } else {
                        setMediaActive(mediaWorking);
                    }
                }
                isTransitioning = false;
            }, 550);
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
