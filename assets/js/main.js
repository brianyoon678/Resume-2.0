// Initialize AOS (Animate On Scroll) library
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Initialize Feather icons
feather.replace();

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    const navigation = document.querySelector('nav');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function () {
            // Add mobile menu functionality here
            console.log('Mobile menu clicked');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // stops default double submission

            emailjs.sendForm('service_gs9hiab', 'template_zl0apgj', contactForm)
                .then(() => {
                    alert('Message sent successfully!');
                    contactForm.reset();
                }, (error) => {
                    alert('Failed to send message: ' + JSON.stringify(error));
                });
        });
    }


    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('nav');
        if (window.scrollY > 100) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Typing animation for hero section (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Intersection Observer for animations (alternative to AOS)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
}