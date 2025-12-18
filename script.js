document.addEventListener('DOMContentLoaded', () => {
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true,
            offset: 100,
            delay: 0,
            anchorPlacement: 'top-bottom'
        });

        // Initialize Lenis Smooth Scroll
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2
        });

        // Lenis animation frame loop with AOS refresh
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Refresh AOS on Lenis scroll for smooth integration
        lenis.on('scroll', AOS.refresh);

        // Anchor link smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '#shop') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        lenis.scrollTo(target, { offset: -70 });
                    }
                }
            });
        });

        // Color Picker Functionality
        const colorPicker = document.getElementById('colorPicker');
        const colorValue = document.getElementById('colorValue');
        const topbar = document.getElementById('topbar');

        if (colorPicker && colorValue && topbar) {
            colorPicker.addEventListener('input', (e) => {
                const color = e.target.value;
                topbar.style.background = color;
                colorValue.textContent = color;
            });
        }

        // Carousel Functionality
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.nav-dot');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentSlide = 0;
        let autoplayInterval;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 10000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoplay();
                startAutoplay();
            });
        });

        // Start autoplay
        startAutoplay();

        // Pause on hover
        const carousel = document.querySelector('.hero-carousel');
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);

        // Topbar scroll hide/show based on hero section visibility
        let isTopbarHidden = false;
        const heroSection = document.querySelector('.hero-carousel');
        const heroHeight = heroSection.offsetHeight;
        const hideThreshold = heroHeight * 0.7; // Hide when 70% of hero is scrolled past

        lenis.on('scroll', ({ scroll }) => {
            const currentScrollY = scroll;

            // Hide topbar when 70% of hero section is scrolled past
            if (currentScrollY >= hideThreshold && !isTopbarHidden) {
                topbar.classList.add('hidden');
                isTopbarHidden = true;
            }
            // Show topbar when scrolling back up above the threshold
            else if (currentScrollY < hideThreshold && isTopbarHidden) {
                topbar.classList.remove('hidden');
                isTopbarHidden = false;
            }
        });

        // Hamburger Menu Toggle
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        function closeMenu() {
            hamburgerBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }

        function openMenu() {
            hamburgerBtn.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        if (hamburgerBtn && mobileMenuOverlay && mobileMenuBackdrop) {
            // Toggle menu when hamburger is clicked
            hamburgerBtn.addEventListener('click', () => {
                if (mobileMenuOverlay.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            // Close menu when a link is clicked
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            // Close menu when clicking on backdrop
            mobileMenuBackdrop.addEventListener('click', closeMenu);
        }
});