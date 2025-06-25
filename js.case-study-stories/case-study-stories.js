// Case Studies Complete JavaScript - Footer Issue Fixed
document.addEventListener('DOMContentLoaded', function() {
    initializeFiltering();
    initializeAnimations();
    initializeScrollEffects();
    initializeMobileNavigation();
    ensureFooterVisible();
});

// Filter functionality for case studies
function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const storyCards = document.querySelectorAll('.case-study-story-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            filterCaseStudies(category, storyCards);
        });
    });
}

function filterCaseStudies(category, cards) {
    let visibleCount = 0;
    
    cards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            // Show card
            card.style.display = 'block';
            visibleCount++;
            
            // Animate appearance
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(card, 
                    { opacity: 0, y: 30, scale: 0.95 }, 
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.6, 
                        delay: visibleCount * 0.1,
                        ease: "power2.out"
                    }
                );
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, visibleCount * 100);
            }
        } else {
            // Hide card
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    opacity: 0,
                    y: -20,
                    scale: 0.95,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        card.style.display = 'none';
                    }
                });
            } else {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // Ensure footer stays visible after filtering
    setTimeout(() => {
        ensureFooterVisible();
    }, 500);
}

// Ensure footer is always visible
function ensureFooterVisible() {
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.style.opacity = '1';
        footer.style.visibility = 'visible';
        footer.style.display = 'block';
        footer.style.position = 'relative';
        footer.style.zIndex = '10';
    }
    
    const footerSections = document.querySelectorAll('.footer-section');
    footerSections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
    });
}

// Initialize GSAP animations
function initializeAnimations() {
    if (typeof gsap === 'undefined') {
        initializeCSSAnimations();
        return;
    }
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Navbar animation
    gsap.set('.navbar', { y: -100 });
    gsap.to('.navbar', {
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2
    });
    
    // Hero section animations
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    
    if (heroTitle) {
        gsap.fromTo(heroTitle, {
            opacity: 0,
            y: 50,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            delay: 0.5,
            ease: "power2.out"
        });
    }
    
    if (heroDescription) {
        gsap.fromTo(heroDescription, {
            opacity: 0,
            y: 30
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.8,
            ease: "power2.out"
        });
    }
    
    // Filter buttons animation
    gsap.fromTo('.filter-btn', {
        opacity: 0,
        y: 20,
        scale: 0.9
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        delay: 1,
        ease: "power2.out"
    });
    
    // Story cards animation with ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo('.case-study-story-card', {
            opacity: 0,
            y: 60,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.case-studies-grid',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Footer animation - keep it always visible
        gsap.set('.footer', {
            opacity: 1,
            visibility: 'visible',
            display: 'block'
        });
        
        gsap.fromTo('.footer-section', {
            opacity: 0,
            y: 40
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 90%',
                toggleActions: 'play none none none'
            }
        });
    } else {
        setTimeout(() => {
            gsap.fromTo('.case-study-story-card', {
                opacity: 0,
                y: 60,
                scale: 0.95
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out"
            });
        }, 1500);
        
        gsap.set('.footer', {
            opacity: 1,
            visibility: 'visible',
            display: 'block'
        });
    }
    
    animateBackgroundBlobs();
}

// CSS fallback animations
function initializeCSSAnimations() {
    const elements = document.querySelectorAll('.hero-title, .hero-description, .filter-btn, .case-study-story-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    ensureFooterVisible();
}

// Background blob animations
function animateBackgroundBlobs() {
    if (typeof gsap === 'undefined') return;
    
    const primaryBlob = document.querySelector('.effect-blob.primary');
    const secondaryBlob = document.querySelector('.effect-blob.secondary');
    
    if (primaryBlob) {
        gsap.to(primaryBlob, {
            x: 100,
            y: 50,
            rotation: 180,
            duration: 20,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
    
    if (secondaryBlob) {
        gsap.to(secondaryBlob, {
            x: -80,
            y: -60,
            rotation: -120,
            duration: 25,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
}

// Scroll effects and navbar behavior
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    ensureFooterVisible();
    
    window.addEventListener('scroll', debounce(() => {
        const currentScrollY = window.scrollY;
        
        // Navbar hide/show behavior
        if (navbar) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 15, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.backdropFilter = 'none';
            }
        }
        
        ensureFooterVisible();
        lastScrollY = currentScrollY;
    }, 10));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile navigation
function initializeMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
}

// Card hover effects
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.case-study-story-card')) {
        const card = e.target.closest('.case-study-story-card');
        if (typeof gsap !== 'undefined') {
            gsap.to(card, { y: -15, duration: 0.3, ease: "power2.out" });
        }
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.case-study-story-card')) {
        const card = e.target.closest('.case-study-story-card');
        if (typeof gsap !== 'undefined') {
            gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
        }
    }
});

// Button hover effects
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('btn-primary')) {
        if (typeof gsap !== 'undefined') {
            gsap.to(e.target, { y: -3, duration: 0.2, ease: "power2.out" });
        }
    }
    
    if (e.target.classList.contains('filter-btn')) {
        if (typeof gsap !== 'undefined') {
            gsap.to(e.target, { y: -2, duration: 0.2, ease: "power2.out" });
        }
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('btn-primary') || e.target.classList.contains('filter-btn')) {
        if (typeof gsap !== 'undefined') {
            gsap.to(e.target, { y: 0, duration: 0.2, ease: "power2.out" });
        }
    }
});

// Intersection Observer fallback
function initializeIntersectionObserver() {
    if (typeof gsap !== 'undefined') return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.case-study-story-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
    
    ensureFooterVisible();
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Multiple safeguards for footer visibility
setInterval(ensureFooterVisible, 2000);

document.addEventListener('animationend', ensureFooterVisible);
document.addEventListener('transitionend', ensureFooterVisible);

window.addEventListener('resize', debounce(ensureFooterVisible, 100));

// Initialize intersection observer
setTimeout(initializeIntersectionObserver, 100);

// Export for external use
window.CaseStudiesJS = {
    filterCaseStudies,
    initializeAnimations,
    ensureFooterVisible
};