// Projects Archive - Interactive Engine
// George Pelealuw • Creative Developer & Designer

document.addEventListener('DOMContentLoaded', () => {

    // ========== 11 AUTHENTIC PROJECTS DATA ==========
    const projectsData = [
        {
            num: '01',
            title: 'The Vault',
            category: 'Web Development',
            catKey: 'web-dev',
            year: '2025',
            img: 'the-vault.png',
            link: 'projects/the-vault.html',
            desc: 'Exclusief digitaal platform voor zeldzame luxe horloges, supercars en jachten met geavanceerde filtering en hoogwaardige editorial esthetiek.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Vercel', 'Luxury UI'],
            color: '#d4af37'
        },
        {
            num: '02',
            title: 'Dapur Ibu',
            category: 'Web Development',
            catKey: 'web-dev',
            year: '2026',
            img: 'dapur ibu.png',
            link: 'projects/dapur-ibu.html',
            desc: 'Modern en warm restaurantplatform voor traditionele Indonesische familierecepten met interactieve menukaart en catering reserveringen.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Responsive'],
            color: '#10b981'
        },
        {
            num: '03',
            title: 'Interactive Duo Project',
            category: 'Interactief & Concept',
            catKey: 'interactive',
            year: '2024',
            img: 'duo.png',
            link: 'projects/duo-project.html',
            desc: 'Educatieve en gegamificeerde quizapplicatie ontworpen voor studenten om spelenderwijs DUO regels en studiefinanciering te leren.',
            tech: ['JavaScript', 'Gamification', 'CSS3', 'Vercel', 'EdTech'],
            color: '#3b82f6'
        },
        {
            num: '04',
            title: 'EduFit',
            category: 'Web Development',
            catKey: 'web-dev',
            year: '2025',
            img: 'edufit_screenshot.png',
            link: 'projects/edufit.html',
            desc: 'Gezondheids- en vitaliteitsapplicatie ontwikkeld voor BureauFIT en het GLR ter ondersteuning van docenten met schema\'s, voeding en mindfulness.',
            tech: ['UI/UX', 'Mobile App', 'JavaScript', 'CSS3', 'Health'],
            color: '#06b6d4'
        },
        {
            num: '05',
            title: 'Yume Ramen',
            category: 'Web Development',
            catKey: 'web-dev',
            year: '2025',
            img: 'yume_ramen_screenshot.png',
            link: 'projects/yume-ramen.html',
            desc: 'Sfeervolle Japanse ramen bezorg- en afhaalapp met vloeiende interacties en menusamenstelling volgens Japanse designprincipes.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'E-Commerce', 'Food UI'],
            color: '#f97316'
        },
        {
            num: '06',
            title: 'VibeSync',
            category: 'Interactief & Concept',
            catKey: 'interactive',
            year: '2026',
            img: 'projects/vibesync.png',
            link: 'projects/vibesync.html',
            desc: 'Innovatieve festivalapp voor realtime crowd-interactie, live setlist visualisatie en dynamische sfeer-synchronisatie via audio.',
            tech: ['Figma', 'UI/UX', 'Concept', 'JavaScript', 'Audio Sync'],
            color: '#ec4899'
        },
        {
            num: '07',
            title: 'King of the Court',
            category: 'Web Development',
            catKey: 'web-dev',
            year: '2025',
            img: 'court_project.png',
            link: 'projects/planning-tool.html',
            desc: 'Toernooi planning en realtime baanindeling applicatie voor dynamische padel- en sportwedstrijden.',
            tech: ['Mobile First', 'JavaScript', 'Toernooi Engine', 'CSS3'],
            color: '#22c55e'
        },
        {
            num: '08',
            title: 'Digitaal Ecosysteem',
            category: 'UI/UX & Design',
            catKey: 'ui-ux',
            year: '2024',
            img: 'ecosysteem_screenshot.png',
            link: 'projects/ecosysteem.html',
            desc: 'Interactieve biologische simulatie met intuïtieve visualisaties van voedselketens en ecosystemen.',
            tech: ['Figma', 'UI/UX', 'Design System', 'Simulatie'],
            color: '#84cc16'
        },
        {
            num: '09',
            title: 'Museum Ervaring',
            category: 'Web Development',
            catKey: 'web-dev',
            year: '2024',
            img: 'museum.png',
            link: 'projects/museum-website.html',
            desc: 'Toegankelijke kunstmuseum website met focus op inclusieve navigatie en visuele verhalen conform WCAG 2.1 AA normen.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'WCAG AA', 'Editorial'],
            color: '#6366f1'
        },
        {
            num: '10',
            title: 'Loading Animations',
            category: 'Interactief & Concept',
            catKey: 'interactive',
            year: '2024',
            img: 'laad.png',
            link: 'projects/loading-animation.html',
            desc: 'Collectie van 60fps SVG en CSS micro-animaties geoptimaliseerd voor vloeiende feedback en laadschermen.',
            tech: ['CSS Keyframes', 'SVG', 'Motion Design', 'Performance'],
            color: '#a855f7'
        },
        {
            num: '11',
            title: 'Album Cover Design',
            category: 'UI/UX & Design',
            catKey: 'ui-ux',
            year: '2023',
            img: 'Album%20Cover_DEF.png',
            link: 'projects/album-cover.html',
            desc: 'Origineel space artwork en typografische albumhoes met vintage sci-fi esthetiek en custom illustraties.',
            tech: ['Photoshop', 'Illustrator', 'Visual Design', 'Artwork'],
            color: '#ef4444'
        }
    ];

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

    // ========== AMBIENT REACTIVE BACKGROUND CANVAS ==========
    const ambientCanvas = document.getElementById('ambientCanvas');
    let ctx = null;
    let canvasWidth = 0;
    let canvasHeight = 0;

    let targetColor = { r: 99, g: 102, b: 241 }; // Default Indigo
    let currentColor = { r: 99, g: 102, b: 241 };

    let mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    let smoothMouse = { x: window.innerWidth / 2, y: window.innerHeight / 3 };

    function hexToRgb(hex) {
        const clean = hex.replace('#', '');
        const bigint = parseInt(clean, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }

    if (ambientCanvas) {
        ctx = ambientCanvas.getContext('2d');

        function resizeCanvas() {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            ambientCanvas.width = canvasWidth;
            ambientCanvas.height = canvasHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        let time = 0;
        function renderAmbientCanvas() {
            time += 0.015;

            // Smooth spring follow for mouse
            smoothMouse.x += (mousePos.x - smoothMouse.x) * 0.05;
            smoothMouse.y += (mousePos.y - smoothMouse.y) * 0.05;

            // Interpolate color toward target
            currentColor.r += (targetColor.r - currentColor.r) * 0.04;
            currentColor.g += (targetColor.g - currentColor.g) * 0.04;
            currentColor.b += (targetColor.b - currentColor.b) * 0.04;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // 1. Mouse follower orb
            const orb1Radius = Math.min(canvasWidth, canvasHeight) * 0.45;
            const grad1 = ctx.createRadialGradient(
                smoothMouse.x, smoothMouse.y, 0,
                smoothMouse.x, smoothMouse.y, orb1Radius
            );
            grad1.addColorStop(0, `rgba(${Math.round(currentColor.r)}, ${Math.round(currentColor.g)}, ${Math.round(currentColor.b)}, 0.4)`);
            grad1.addColorStop(0.5, `rgba(${Math.round(currentColor.r)}, ${Math.round(currentColor.g)}, ${Math.round(currentColor.b)}, 0.12)`);
            grad1.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad1;
            ctx.beginPath();
            ctx.arc(smoothMouse.x, smoothMouse.y, orb1Radius, 0, Math.PI * 2);
            ctx.fill();

            // 2. Floating secondary orb (top right drift)
            const orb2X = canvasWidth * 0.75 + Math.sin(time * 0.8) * 120;
            const orb2Y = canvasHeight * 0.3 + Math.cos(time * 0.6) * 100;
            const orb2Radius = Math.min(canvasWidth, canvasHeight) * 0.4;
            const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, orb2Radius);
            grad2.addColorStop(0, 'rgba(147, 51, 234, 0.25)'); // Violet
            grad2.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad2;
            ctx.beginPath();
            ctx.arc(orb2X, orb2Y, orb2Radius, 0, Math.PI * 2);
            ctx.fill();

            // 3. Floating tertiary orb (bottom left drift)
            const orb3X = canvasWidth * 0.25 + Math.cos(time * 0.7) * 100;
            const orb3Y = canvasHeight * 0.7 + Math.sin(time * 0.9) * 80;
            const orb3Radius = Math.min(canvasWidth, canvasHeight) * 0.35;
            const grad3 = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, orb3Radius);
            grad3.addColorStop(0, 'rgba(6, 182, 212, 0.2)'); // Cyan
            grad3.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad3;
            ctx.beginPath();
            ctx.arc(orb3X, orb3Y, orb3Radius, 0, Math.PI * 2);
            ctx.fill();

            requestAnimationFrame(renderAmbientCanvas);
        }
        renderAmbientCanvas();
    }

    // ========== DOM ELEMENTS ==========
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('projectSearch');
    const viewButtons = document.querySelectorAll('.view-btn');
    const gridView = document.getElementById('projectsGrid');
    const showcaseView = document.getElementById('projectsShowcase');
    const listView = document.getElementById('projectsList');
    const emptyState = document.getElementById('emptyState');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');

    const gridCards = document.querySelectorAll('.creative-project-card');
    const listItems = document.querySelectorAll('.list-item');

    let currentCategory = 'all';
    let searchQuery = '';
    let currentView = 'grid';

    // ========== HOLOGRAPHIC CARD GLARE & 3D TILT ==========
    gridCards.forEach((card, index) => {
        const visual = card.querySelector('.card-visual-wrapper') || card;
        const project = projectsData[index];

        card.addEventListener('mousemove', (e) => {
            const rect = visual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            visual.style.setProperty('--mouse-x', `${x}px`);
            visual.style.setProperty('--mouse-y', `${y}px`);

            const normX = (x / rect.width) - 0.5;
            const normY = (y / rect.height) - 0.5;

            visual.style.transform = `
                translateY(-8px)
                perspective(1000px)
                rotateX(${-normY * 6}deg)
                rotateY(${normX * 6}deg)
            `;
        });

        card.addEventListener('mouseenter', () => {
            if (project && project.color) {
                targetColor = hexToRgb(project.color);
            }
        });

        card.addEventListener('mouseleave', () => {
            visual.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)';
            targetColor = { r: 99, g: 102, b: 241 };
        });
    });

    // ========== SHOWCASE 3D COVERFLOW ENGINE ==========
    const showcaseSlider = document.getElementById('showcaseSlider');
    const showcasePrev = document.getElementById('showcasePrev');
    const showcaseNext = document.getElementById('showcaseNext');
    const showcaseDotsContainer = document.getElementById('showcaseDots');
    const showcaseCounter = document.getElementById('showcaseCounter');

    let activeShowcaseIndex = 0;
    let filteredShowcaseIndices = projectsData.map((_, i) => i);

    function buildShowcaseSlides() {
        if (!showcaseSlider) return;
        showcaseSlider.innerHTML = '';
        showcaseDotsContainer.innerHTML = '';

        filteredShowcaseIndices.forEach((dataIndex, pos) => {
            const p = projectsData[dataIndex];

            // Create slide
            const slide = document.createElement('a');
            slide.href = p.link;
            slide.className = 'showcase-slide';
            slide.setAttribute('data-index', dataIndex);

            slide.innerHTML = `
                <div class="showcase-slide-media">
                    <img src="${p.img}" alt="${p.title}" decoding="async">
                    <div class="showcase-slide-overlay">
                        <div class="showcase-overlay-top">
                            <span class="showcase-slide-num">${p.num}</span>
                            <span class="card-live-pill">${p.category}</span>
                        </div>
                        <div class="showcase-overlay-bottom">
                            <div>
                                <h3 class="showcase-slide-title">${p.title}</h3>
                                <div class="showcase-slide-meta">
                                    <span>${p.category}</span>
                                    <span>•</span>
                                    <span>${p.year}</span>
                                </div>
                            </div>
                            <span class="showcase-slide-cta">
                                <span>Ontdek Project</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                            </span>
                        </div>
                    </div>
                </div>
            `;

            // Clicking side slides jumps to that slide instead of navigating away
            slide.addEventListener('click', (e) => {
                if (pos !== activeShowcaseIndex) {
                    e.preventDefault();
                    setActiveShowcaseIndex(pos);
                }
            });

            showcaseSlider.appendChild(slide);

            // Create dot
            const dot = document.createElement('button');
            dot.className = `showcase-dot ${pos === activeShowcaseIndex ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Ga naar slide ${pos + 1}`);
            dot.addEventListener('click', () => setActiveShowcaseIndex(pos));
            showcaseDotsContainer.appendChild(dot);
        });

        updateShowcaseSlidePositions();
    }

    function updateShowcaseSlidePositions() {
        const slides = showcaseSlider ? showcaseSlider.querySelectorAll('.showcase-slide') : [];
        const dots = showcaseDotsContainer ? showcaseDotsContainer.querySelectorAll('.showcase-dot') : [];

        if (filteredShowcaseIndices.length === 0) {
            if (showcaseCounter) showcaseCounter.textContent = '00 / 00';
            return;
        }

        slides.forEach((slide, idx) => {
            slide.classList.remove('active', 'prev', 'next', 'hidden-left', 'hidden-right');

            if (idx === activeShowcaseIndex) {
                slide.classList.add('active');
            } else if (idx === activeShowcaseIndex - 1) {
                slide.classList.add('prev');
            } else if (idx === activeShowcaseIndex + 1) {
                slide.classList.add('next');
            } else if (idx < activeShowcaseIndex) {
                slide.classList.add('hidden-left');
            } else {
                slide.classList.add('hidden-right');
            }
        });

        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeShowcaseIndex);
        });

        const activeProjectDataIndex = filteredShowcaseIndices[activeShowcaseIndex];
        const activeProj = projectsData[activeProjectDataIndex];

        if (activeProj) {
            targetColor = hexToRgb(activeProj.color);
            if (showcaseCounter) {
                const currentFormatted = String(activeShowcaseIndex + 1).padStart(2, '0');
                const totalFormatted = String(filteredShowcaseIndices.length).padStart(2, '0');
                showcaseCounter.textContent = `${currentFormatted} / ${totalFormatted}`;
            }
        }
    }

    function setActiveShowcaseIndex(index) {
        if (filteredShowcaseIndices.length === 0) return;
        activeShowcaseIndex = Math.max(0, Math.min(index, filteredShowcaseIndices.length - 1));
        updateShowcaseSlidePositions();
    }

    if (showcasePrev) {
        showcasePrev.addEventListener('click', () => {
            setActiveShowcaseIndex(activeShowcaseIndex - 1);
        });
    }

    if (showcaseNext) {
        showcaseNext.addEventListener('click', () => {
            setActiveShowcaseIndex(activeShowcaseIndex + 1);
        });
    }

    // Keyboard arrow keys for showcase slider
    window.addEventListener('keydown', (e) => {
        if (currentView === 'showcase') {
            if (e.key === 'ArrowLeft') setActiveShowcaseIndex(activeShowcaseIndex - 1);
            if (e.key === 'ArrowRight') setActiveShowcaseIndex(activeShowcaseIndex + 1);
        }
    });

    buildShowcaseSlides();

    // ========== FILTERING LOGIC ==========
    function filterProjects() {
        let visibleCount = 0;
        filteredShowcaseIndices = [];

        // 1. Filter Grid Cards
        gridCards.forEach((card, idx) => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title').toLowerCase();
            const tags = card.getAttribute('data-tech').toLowerCase();

            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = !searchQuery || title.includes(searchQuery) || tags.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
                filteredShowcaseIndices.push(idx);
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(card,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
                    );
                }
            } else {
                card.style.display = 'none';
            }
        });

        // 2. Filter List Items
        listItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const title = item.getAttribute('data-title').toLowerCase();
            const tags = item.getAttribute('data-tech').toLowerCase();

            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = !searchQuery || title.includes(searchQuery) || tags.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });

        // 3. Rebuild Showcase Slides for filtered subset
        activeShowcaseIndex = 0;
        buildShowcaseSlides();

        // Toggle Empty State
        if (visibleCount === 0) {
            emptyState.classList.add('visible');
            if (gridView) gridView.style.display = 'none';
            if (showcaseView) showcaseView.style.display = 'none';
            if (listView) listView.style.display = 'none';
        } else {
            emptyState.classList.remove('visible');
            updateActiveViewDisplay();
        }
    }

    function updateActiveViewDisplay() {
        if (gridView) gridView.style.display = currentView === 'grid' ? 'grid' : 'none';
        if (showcaseView) {
            showcaseView.style.display = currentView === 'showcase' ? 'flex' : 'none';
            showcaseView.classList.toggle('active', currentView === 'showcase');
            if (currentView === 'showcase') updateShowcaseSlidePositions();
        }
        if (listView) {
            listView.style.display = currentView === 'list' ? 'flex' : 'none';
            listView.classList.toggle('active', currentView === 'list');
        }
    }

    // Filter Buttons Click
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            filterProjects();
        });
    });

    // Search Input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            filterProjects();
        });
    }

    // Reset Filters
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            currentCategory = 'all';
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            filterButtons.forEach(b => b.classList.remove('active'));
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            filterProjects();
        });
    }

    // ========== VIEW SWITCHER (GRID | SHOWCASE | LIJST) ==========
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.getAttribute('data-view');
            updateActiveViewDisplay();
        });
    });

    // ========== RANDOM PROJECT SHUFFLE ACTION ("VERRAS ME 🎲") ==========
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * projectsData.length);
            const randomProj = projectsData[randomIndex];

            if (currentView === 'showcase') {
                const targetPos = filteredShowcaseIndices.indexOf(randomIndex);
                if (targetPos !== -1) {
                    setActiveShowcaseIndex(targetPos);
                }
            } else if (currentView === 'grid') {
                const targetCard = gridCards[randomIndex];
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetCard.classList.remove('project-card-highlight');
                    void targetCard.offsetWidth; // force reflow
                    targetCard.classList.add('project-card-highlight');
                    targetColor = hexToRgb(randomProj.color);
                }
            } else {
                openQuickViewModal(randomIndex);
            }
        });
    }

    // ========== INTERACTIVE QUICK VIEW GLASS MODAL ==========
    const quickModalBackdrop = document.getElementById('quickModalBackdrop');
    const quickModalClose = document.getElementById('quickModalClose');
    const quickModalImg = document.getElementById('quickModalImg');
    const quickModalNum = document.getElementById('quickModalNum');
    const quickModalCat = document.getElementById('quickModalCat');
    const quickModalTitle = document.getElementById('quickModalTitle');
    const quickModalDesc = document.getElementById('quickModalDesc');
    const quickModalTech = document.getElementById('quickModalTech');
    const quickModalLink = document.getElementById('quickModalLink');
    const quickModalPrev = document.getElementById('quickModalPrev');
    const quickModalNext = document.getElementById('quickModalNext');

    let currentModalIndex = 0;

    function openQuickViewModal(index) {
        currentModalIndex = index;
        const p = projectsData[index];
        if (!p) return;

        quickModalImg.src = p.img;
        quickModalNum.textContent = p.num;
        quickModalCat.textContent = p.category;
        quickModalTitle.textContent = p.title;
        quickModalDesc.textContent = p.desc;
        quickModalLink.href = p.link;

        quickModalTech.innerHTML = '';
        p.tech.forEach(t => {
            const pill = document.createElement('span');
            pill.className = 'quick-modal-pill';
            pill.textContent = t;
            quickModalTech.appendChild(pill);
        });

        quickModalBackdrop.classList.add('active');
        quickModalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        targetColor = hexToRgb(p.color);
    }

    function closeQuickViewModal() {
        quickModalBackdrop.classList.remove('active');
        quickModalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        targetColor = { r: 99, g: 102, b: 241 };
    }

    document.querySelectorAll('.quick-view-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectIdx = parseInt(btn.getAttribute('data-project'), 10);
            openQuickViewModal(projectIdx);
        });
    });

    if (quickModalClose) quickModalClose.addEventListener('click', closeQuickViewModal);

    if (quickModalBackdrop) {
        quickModalBackdrop.addEventListener('click', (e) => {
            if (e.target === quickModalBackdrop) closeQuickViewModal();
        });
    }

    if (quickModalPrev) {
        quickModalPrev.addEventListener('click', () => {
            const prevIdx = (currentModalIndex - 1 + projectsData.length) % projectsData.length;
            openQuickViewModal(prevIdx);
        });
    }

    if (quickModalNext) {
        quickModalNext.addEventListener('click', () => {
            const nextIdx = (currentModalIndex + 1) % projectsData.length;
            openQuickViewModal(nextIdx);
        });
    }

    window.addEventListener('keydown', (e) => {
        if (quickModalBackdrop && quickModalBackdrop.classList.contains('active')) {
            if (e.key === 'Escape') closeQuickViewModal();
            if (e.key === 'ArrowLeft') {
                const prevIdx = (currentModalIndex - 1 + projectsData.length) % projectsData.length;
                openQuickViewModal(prevIdx);
            }
            if (e.key === 'ArrowRight') {
                const nextIdx = (currentModalIndex + 1) % projectsData.length;
                openQuickViewModal(nextIdx);
            }
        }
    });

    // ========== CURSOR FLOATING PREVIEW (LIST VIEW) ==========
    const previewModal = document.getElementById('cursorPreviewModal');
    const previewImg = previewModal ? previewModal.querySelector('img') : null;

    let mouseX = 0;
    let mouseY = 0;
    let previewX = 0;
    let previewY = 0;
    let isPreviewActive = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updatePreviewPosition() {
        if (isPreviewActive && previewModal) {
            previewX += (mouseX - previewX) * 0.12;
            previewY += (mouseY - previewY) * 0.12;

            previewModal.style.left = `${previewX + 24}px`;
            previewModal.style.top = `${previewY - 100}px`;
        }
        requestAnimationFrame(updatePreviewPosition);
    }
    requestAnimationFrame(updatePreviewPosition);

    listItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const imgSrc = item.getAttribute('data-img');
            const dataIdx = item.getAttribute('data-index');
            if (previewImg && imgSrc) {
                previewImg.src = imgSrc;
            }
            if (previewModal) {
                previewModal.classList.add('visible');
                isPreviewActive = true;
            }
            if (dataIdx && projectsData[dataIdx]) {
                targetColor = hexToRgb(projectsData[dataIdx].color);
            }
        });

        item.addEventListener('mouseleave', () => {
            if (previewModal) {
                previewModal.classList.remove('visible');
                isPreviewActive = false;
            }
            targetColor = { r: 99, g: 102, b: 241 };
        });
    });

    // ========== INITIAL ENTRANCE ANIMATION ==========
    if (typeof gsap !== 'undefined') {
        gsap.from('.projects-hero-inner > *', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });

        gsap.from('.creative-project-card', {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
            delay: 0.15
        });
    }

});
