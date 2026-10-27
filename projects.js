// Projects Archive - Interactive Engine
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

    // ========== ELEMENTS ==========
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('projectSearch');
    const viewButtons = document.querySelectorAll('.view-btn');
    const gridView = document.getElementById('projectsGrid');
    const listView = document.getElementById('projectsList');
    const emptyState = document.getElementById('emptyState');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    const gridCards = document.querySelectorAll('.creative-project-card, .archive-card');
    const listItems = document.querySelectorAll('.list-item');

    let currentCategory = 'all';
    let searchQuery = '';

    // ========== FILTERING LOGIC ==========
    function filterProjects() {
        let visibleCount = 0;

        // Filter Grid Cards
        gridCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title').toLowerCase();
            const tags = card.getAttribute('data-tech').toLowerCase();

            const matchesCategory = (currentCategory === 'all' || category === currentCategory);
            const matchesSearch = !searchQuery || title.includes(searchQuery) || tags.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(card, 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                    );
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Filter List Items
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

        // Toggle Empty State
        if (visibleCount === 0) {
            emptyState.classList.add('visible');
            if (gridView) gridView.style.display = 'none';
            if (listView) listView.style.display = 'none';
        } else {
            emptyState.classList.remove('visible');
            const isListActive = document.querySelector('.view-btn[data-view="list"].active');
            if (isListActive) {
                if (gridView) gridView.style.display = 'none';
                if (listView) listView.style.display = 'flex';
            } else {
                if (gridView) gridView.style.display = 'grid';
                if (listView) listView.style.display = 'none';
            }
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

    // ========== VIEW SWITCHER ==========
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.getAttribute('data-view');

            if (view === 'list') {
                if (gridView) gridView.style.display = 'none';
                if (listView) {
                    listView.style.display = 'flex';
                    listView.classList.add('active');
                }
            } else {
                if (listView) {
                    listView.style.display = 'none';
                    listView.classList.remove('active');
                }
                if (gridView) gridView.style.display = 'grid';
            }
            filterProjects();
        });
    });

    // ========== 3D CARD PARALLAX TILT ==========
    gridCards.forEach(card => {
        const visual = card.querySelector('.card-visual-wrapper') || card;

        card.addEventListener('mousemove', (e) => {
            const rect = visual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            visual.style.transform = `
                translateY(-6px)
                perspective(1000px)
                rotateX(${-y * 6}deg)
                rotateY(${x * 6}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            visual.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
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
            // Smooth lerp follow
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
            if (previewImg && imgSrc) {
                previewImg.src = imgSrc;
            }
            if (previewModal) {
                previewModal.classList.add('visible');
                isPreviewActive = true;
            }
        });

        item.addEventListener('mouseleave', () => {
            if (previewModal) {
                previewModal.classList.remove('visible');
                isPreviewActive = false;
            }
        });
    });

    // ========== INITIAL ANIMATION ==========
    if (typeof gsap !== 'undefined') {
        gsap.from('.projects-hero-inner > *', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });

        gsap.from('.creative-project-card, .archive-card', {
            opacity: 0,
            y: 30,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power3.out',
            delay: 0.15
        });
    }

});
