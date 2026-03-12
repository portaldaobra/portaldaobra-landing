// Smooth scrolling navigation
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handler
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Formulário enviado! Entraremos em contato em breve.');
        });
    }

    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('shadow-lg');
            } else {
                header.classList.remove('shadow-lg');
            }
        }
    });

    // GSAP Animation for "Como Funciona" Section Only
    gsap.registerPlugin(ScrollTrigger);

    // Aggressive Hero Section Protection
    function forceCleanHeroSection() {
        const heroSection = document.querySelector('section:first-of-type');
        if (heroSection) {
            const allElements = heroSection.querySelectorAll('*');
            allElements.forEach(el => {
                // Completely remove style attribute if it contains GSAP properties
                if (el.hasAttribute('style')) {
                    const style = el.getAttribute('style');
                    if (style.includes('translate') || style.includes('transform') || style.includes('scale') || style.includes('rotate')) {
                        el.removeAttribute('style');
                    }
                }
            });
        }
    }

    // MutationObserver to watch for style changes
    const heroObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                const heroSection = document.querySelector('section:first-of-type');
                if (heroSection && heroSection.contains(target)) {
                    const style = target.getAttribute('style');
                    if (style && (style.includes('translate') || style.includes('transform') || style.includes('scale') || style.includes('rotate'))) {
                        target.removeAttribute('style');
                    }
                }
            }
        });
    });

    // Start observing
    heroObserver.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['style']
    });

    // Initial cleanup
    forceCleanHeroSection();
    setTimeout(forceCleanHeroSection, 100);
    setTimeout(forceCleanHeroSection, 500);

    // Animate section title and subtitle
    gsap.fromTo("#como-funciona h2", {
        y: 50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#como-funciona",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.fromTo("#como-funciona p", {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#como-funciona",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate the 3 step cards with stagger
    gsap.fromTo(".card-como-funciona", {
        y: 100,
        opacity: 0,
        scale: 0.8
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: "back.out(1.2)",
        scrollTrigger: {
            trigger: "#como-funciona .grid",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate step numbers with bounce effect
    gsap.fromTo("#como-funciona [class*='rounded-full'][style*='background']", {
        scale: 0,
        rotation: 180
    }, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 0.5,
        scrollTrigger: {
            trigger: "#como-funciona .grid",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate connecting lines (desktop only)
    gsap.fromTo("#como-funciona .hidden.lg\\:block.absolute[style*='border']", {
        scaleX: 0,
        opacity: 0
    }, {
        scaleX: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.inOut",
        delay: 1,
        scrollTrigger: {
            trigger: "#como-funciona .grid",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    // Final CTA button animation
    gsap.fromTo("#como-funciona button, #como-funciona a[class*='bg-']", {
        y: 50,
        opacity: 0,
        scale: 0.9
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.3)",
        delay: 1.5,
        scrollTrigger: {
            trigger: "#como-funciona .grid",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    // GSAP Animation for "Empresas que confiam" Section
    
    // Animate section title and subtitle
    gsap.fromTo(".py-16.bg-\\[\\#001D4A\\] h2", {
        y: 60,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".py-16.bg-\\[\\#001D4A\\]",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    gsap.fromTo(".py-16.bg-\\[\\#001D4A\\] .text-blue-200", {
        y: 30,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".py-16.bg-\\[\\#001D4A\\]",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate logos container
    gsap.fromTo(".bg-\\[\\#0047AB\\]", {
        scale: 0.8,
        opacity: 0,
        y: 50
    }, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.2)",
        delay: 0.6,
        scrollTrigger: {
            trigger: ".bg-\\[\\#0047AB\\]",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate individual logos with stagger
    gsap.fromTo(".bg-\\[\\#0047AB\\] img", {
        scale: 0,
        opacity: 0,
        rotation: 15
    }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)",
        delay: 1,
        scrollTrigger: {
            trigger: ".bg-\\[\\#0047AB\\]",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate testimonials
    gsap.fromTo(".grid.grid-cols-1.md\\:grid-cols-2 > div", {
        y: 80,
        opacity: 0,
        scale: 0.9
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 1,
        scrollTrigger: {
            trigger: ".grid.grid-cols-1.md\\:grid-cols-2",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Animate stars in testimonials
    gsap.fromTo(".grid.grid-cols-1.md\\:grid-cols-2 .flex.gap-1 img", {
        scale: 0,
        rotation: 180
    }, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(2)",
        delay: 1.4,
        scrollTrigger: {
            trigger: ".grid.grid-cols-1.md\\:grid-cols-2",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Final CTA button animation
    gsap.fromTo(".py-16.bg-\\[\\#001D4A\\] button", {
        y: 50,
        opacity: 0,
        scale: 0.8
    }, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.3)",
        delay: 1.4,
        scrollTrigger: {
            trigger: ".grid.grid-cols-1.md\\:grid-cols-2",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Hover Effects for Buttons in All Sections
    // Hero Section, "Como Funciona" and "Empresas que confiam" buttons
    document.querySelectorAll('button[onclick*="wa.me"], a[href*="wa.me"], #como-funciona button, #como-funciona a[class*="bg-"], .py-16.bg-\\[\\#001D4A\\] button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                y: -5,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Mobile menu toggle (if exists)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
});