document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        offset: 100,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    initializeNavigation();
    initializeScrollEffects();
    initializeFAQ();
    initializeSmoothScroll();
    trackUserInteractions();
});

function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.borderBottomColor = 'rgba(0, 212, 255, 0.2)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.1)';
        } else {
            navbar.style.borderBottomColor = 'rgba(42, 49, 85, 1)';
            navbar.style.boxShadow = 'none';
        }
    });
}

function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            const scrollPosition = window.scrollY;
            heroImage.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });
}

function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const otherAnswers = document.querySelectorAll('.faq-answer.active');
            const otherQuestions = document.querySelectorAll('.faq-question.active');

            otherAnswers.forEach(answer => {
                if (answer !== this.nextElementSibling) {
                    answer.classList.remove('active');
                }
            });

            otherQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                }
            });

            this.classList.toggle('active');
            this.nextElementSibling.classList.toggle('active');
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function trackConversion(conversionType) {
    if (window.fbq) {
        fbq('track', conversionType);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-large');

    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackConversion('InitiateCheckout');
            console.log('WhatsApp click tracked');
        });
    });

    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackConversion('ViewContent');
            console.log('CTA click tracked');
        });
    });
});

function trackUserInteractions() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log(`Feature ${index + 1} viewed`);
                }
            });
        });
        observer.observe(card);
    });
}

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}