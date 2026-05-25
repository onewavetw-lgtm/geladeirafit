// Initialize Intersection Observer for fade-in animations on scroll
document.addEventListener("DOMContentLoaded", () => {
    // Current Date logic for Urgency
    const dateSpan = document.getElementById('current-date');
    if (dateSpan) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        dateSpan.textContent = dd + '/' + mm + '/' + yyyy;
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ Accordion Logic
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle current button active state
            const isActive = btn.classList.contains('active');

            // Close all other accordions
            faqBtns.forEach(otherBtn => {
                otherBtn.classList.remove('active');
            });

            // If it wasn't active, open it
            if (!isActive) {
                btn.classList.add('active');
            }
        });
    });

    // Carousel Logic - Smooth Transition and Controls
    const carousels = document.querySelectorAll('[role="region"][aria-roledescription="carousel"]');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.flex');
        if (!track) return;

        // Override baked static styles with smooth transitions
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = 'translate3d(0px, 0px, 0px)';

        const slides = track.querySelectorAll('[role="group"][aria-roledescription="slide"]');
        const prevBtn = carousel.querySelectorAll('button')[0];
        const nextBtn = carousel.querySelectorAll('button')[1];

        let currentIndex = 0;

        const updateCarousel = () => {
            if (!slides.length) return;
            const slideWidth = slides[0].getBoundingClientRect().width;
            const containerWidth = track.parentElement.getBoundingClientRect().width;
            const visibleSlides = Math.round(containerWidth / slideWidth);
            const maxIndex = Math.max(0, slides.length - visibleSlides);

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            track.style.transform = `translate3d(-${currentIndex * slideWidth}px, 0px, 0px)`;
        };

        window.addEventListener('resize', updateCarousel);

        // Timeout to allow initial layout to settle
        setTimeout(updateCarousel, 100);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                }
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const slideWidth = slides[0].getBoundingClientRect().width;
                const containerWidth = track.parentElement.getBoundingClientRect().width;
                const visibleSlides = Math.round(containerWidth / slideWidth);
                const maxIndex = Math.max(0, slides.length - visibleSlides);

                if (currentIndex < maxIndex) {
                    currentIndex++;
                }
                updateCarousel();
            });
        }

        // Touch / Swipe Navigation support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const slideWidth = slides[0].getBoundingClientRect().width;
            const currentTranslate = -(currentIndex * slideWidth);
            track.style.transform = `translate3d(${currentTranslate + diff}px, 0px, 0px)`;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = 'transform 0.4s ease-in-out';

            const diff = currentX - startX;
            if (Math.abs(diff) > 40) {
                if (diff > 0 && currentIndex > 0) {
                    currentIndex--; // Swipe right (prev)
                } else if (diff < 0) {
                    // Swipe left (next)
                    const slideWidth = slides[0].getBoundingClientRect().width;
                    const containerWidth = track.parentElement.getBoundingClientRect().width;
                    const visibleSlides = Math.round(containerWidth / slideWidth);
                    const maxIndex = Math.max(0, slides.length - visibleSlides);

                    if (currentIndex < maxIndex) {
                        currentIndex++;
                    }
                }
            }
            updateCarousel();
        });
    });
});
