/* ============================================
   LC RENOVATION - Plaquiste et Peinture
   JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // === PRELOADER ===
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => preloader.classList.add('loaded'));
        setTimeout(() => preloader.classList.add('loaded'), 2500);
    }

    // === MOBILE MENU ===
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navOverlay = document.querySelector('.nav-overlay');

    function closeMenu() {
        hamburger && hamburger.classList.remove('active');
        navMenu && navMenu.classList.remove('active');
        navOverlay && navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            navOverlay && navOverlay.classList.toggle('active');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    navOverlay && navOverlay.addEventListener('click', closeMenu);
    document.querySelectorAll('.nav-menu a').forEach(l => l.addEventListener('click', closeMenu));

    // === HEADER SCROLL ===
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.pageYOffset > 80);
        });
    }

    // === SCROLL TO TOP ===
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.pageYOffset > 500);
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // === FADE IN / SCROLL ANIMATIONS ===
    const animatedEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (animatedEls.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // stagger animations within same viewport batch
                    setTimeout(() => entry.target.classList.add('visible'), i * 80);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        animatedEls.forEach(el => obs.observe(el));
    }

    // === COUNTER ANIMATION ===
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length) {
        const cObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.count) || 0;
                    const suffix = el.dataset.suffix || '';
                    let current = 0;
                    const step = Math.max(1, Math.ceil(target / 50));
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        el.textContent = current + suffix;
                    }, 30);
                    cObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => cObs.observe(c));
    }

    // === HERO SLIDER ===
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // === LIGHTBOX ===
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');

    if (galleryItems.length && lightbox) {
        const lbImg = lightbox.querySelector('img');
        const lbClose = lightbox.querySelector('.lightbox-close');
        const lbPrev = lightbox.querySelector('.lightbox-prev');
        const lbNext = lightbox.querySelector('.lightbox-next');
        const images = [];
        let idx = 0;

        galleryItems.forEach((item, i) => {
            const img = item.querySelector('img');
            if (img) {
                images.push(img.src);
                item.addEventListener('click', () => {
                    idx = i;
                    lbImg.src = images[idx];
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
        });

        function closeLB() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function prevImg(e) {
            e && e.stopPropagation();
            idx = (idx - 1 + images.length) % images.length;
            lbImg.src = images[idx];
        }

        function nextImg(e) {
            e && e.stopPropagation();
            idx = (idx + 1) % images.length;
            lbImg.src = images[idx];
        }

        lbClose && lbClose.addEventListener('click', closeLB);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
        lbPrev && lbPrev.addEventListener('click', prevImg);
        lbNext && lbNext.addEventListener('click', nextImg);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLB();
            if (e.key === 'ArrowLeft') prevImg();
            if (e.key === 'ArrowRight') nextImg();
        });
    }

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = (document.querySelector('.header') || { offsetHeight: 0 }).offsetHeight;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === ACTIVE NAV ===
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // === CONTACT FORM ===
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let ok = true;
            this.querySelectorAll('[required]').forEach(f => {
                if (!f.value.trim()) {
                    f.style.borderColor = '#C41E2A';
                    ok = false;
                } else {
                    f.style.borderColor = '';
                }
            });
            const email = this.querySelector('input[type="email"]');
            if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = '#C41E2A';
                ok = false;
            }
            if (ok) {
                alert('Merci pour votre message ! Nous vous recontacterons dans les plus brefs d\u00e9lais.');
                this.reset();
            }
        });
    }

    // === PARALLAX subtle sur hero ===
    const heroBg = document.querySelector('.hero');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const y = window.pageYOffset;
            const slides = heroBg.querySelectorAll('.hero-slide img');
            slides.forEach(img => {
                img.style.transform = 'translateY(' + (y * 0.3) + 'px) scale(1.1)';
            });
        });
    }
});
