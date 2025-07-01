// Fiverr Algorithm Case Study JavaScript - Enhanced Experience
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeInteractiveElements();
    addReadingProgress();
    setupIntersectionObserver();
});

// Initialize GSAP animations
function initializeAnimations() {
    if (typeof gsap === 'undefined') {
        initializeCSSAnimations();
        return;
    }
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Back button animation
    gsap.fromTo('.back-btn', {
        opacity: 0,
        x: -50
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
    });
    
    // Story category animation
    gsap.fromTo('.story-category', {
        opacity: 0,
        y: 30,
        scale: 0.9
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 0.5,
        ease: "power2.out"
    });
    
    // Story title animation
    gsap.fromTo('.story-title', {
        opacity: 0,
        y: 50,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: 0.7,
        ease: "power2.out"
    });
    
    // Story subtitle animation
    gsap.fromTo('.story-subtitle', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.9,
        ease: "power2.out"
    });
    
    // Story meta animation
    gsap.fromTo('.story-meta span', {
        opacity: 0,
        y: 20
    }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 1.1,
        ease: "power2.out"
    });
    
    // Story image animation
    gsap.fromTo('.story-image', {
        opacity: 0,
        y: 60,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: 1.3,
        ease: "power2.out"
    });

    // Author card animation
    gsap.fromTo('.author-card', {
        opacity: 0,
        y: 40,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 1.5,
        ease: "power2.out"
    });
    
    // Animate story sections on scroll
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo('.story-section', {
            opacity: 0,
            y: 80,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.story-content',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate keyword items
        gsap.fromTo('.keyword-item', {
            opacity: 0,
            y: 40,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.keyword-analysis',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate tag strategy sections
        gsap.fromTo('.tag-group', {
            opacity: 0,
            x: -60
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.tags-strategy',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate FAQ items
        gsap.fromTo('.faq-item', {
            opacity: 0,
            y: 50,
            rotationY: 15
        }, {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.faq-examples',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate pricing tiers
        gsap.fromTo('.pricing-tier', {
            opacity: 0,
            y: 40,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.pricing-examples',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate file comparison
        gsap.fromTo('.file-comparison > div', {
            opacity: 0,
            y: 40,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.file-examples',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate results grid
        gsap.fromTo('.result-item', {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.results-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate checklist items
        gsap.fromTo('.checklist-item', {
            opacity: 0,
            x: -40
        }, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.workflow-summary',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate CTA
        gsap.fromTo('.story-cta', {
            opacity: 0,
            y: 60,
            scale: 0.95
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.story-cta',
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        });
    }
    
    // Background blob animations
    animateBackgroundBlobs();
}

// CSS fallback animations
function initializeCSSAnimations() {
    const elements = document.querySelectorAll('.back-btn, .story-category, .story-title, .story-subtitle, .story-meta span, .story-image, .author-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Background blob animations
function animateBackgroundBlobs() {
    if (typeof gsap === 'undefined') return;
    
    const primaryBlob = document.querySelector('.effect-blob.primary');
    const secondaryBlob = document.querySelector('.effect-blob.secondary');
    
    if (primaryBlob) {
        gsap.to(primaryBlob, {
            x: 150,
            y: 100,
            rotation: 180,
            duration: 25,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
    
    if (secondaryBlob) {
        gsap.to(secondaryBlob, {
            x: -120,
            y: -80,
            rotation: -120,
            duration: 30,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    const backBtn = document.querySelector('.back-btn');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', debounce(() => {
        const currentScrollY = window.scrollY;
        
        // Back button behavior on scroll
        if (backBtn) {
            if (currentScrollY > 100) {
                backBtn.style.background = 'rgba(10, 10, 15, 0.95)';
                backBtn.style.backdropFilter = 'blur(20px)';
                backBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            } else {
                backBtn.style.background = 'rgba(255, 255, 255, 0.05)';
                backBtn.style.backdropFilter = 'blur(20px)';
                backBtn.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            }
        }
        
        lastScrollY = currentScrollY;
    }, 10));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Interactive elements
function initializeInteractiveElements() {
    // Back button hover effect
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(backBtn, {
                    y: -3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        backBtn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(backBtn, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    }
    
    // CTA buttons hover effects
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    y: -5,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Section hover effects
    document.querySelectorAll('.story-section').forEach(section => {
        section.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(section, {
                    y: -5,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        section.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(section, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Keyword items hover effect
    document.querySelectorAll('.keyword-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    y: -8,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Result items celebration effect
    document.querySelectorAll('.result-item.success').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    y: -10,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                
                // Subtle pulse effect on the icon
                const icon = item.querySelector('i');
                if (icon) {
                    gsap.to(icon, {
                        scale: 1.2,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                const icon = item.querySelector('i');
                if (icon) {
                    gsap.to(icon, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            }
        });
    });
    
    // Pricing tier hover effects
    document.querySelectorAll('.pricing-tier').forEach(tier => {
        tier.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(tier, {
                    y: -5,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        tier.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(tier, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // FAQ item interactions
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    y: -3,
                    scale: 1.01,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Checklist item check animation
    document.querySelectorAll('.checklist-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const checkIcon = item.querySelector('i');
            if (checkIcon && typeof gsap !== 'undefined') {
                gsap.to(checkIcon, {
                    scale: 1.2,
                    rotation: 15,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const checkIcon = item.querySelector('i');
            if (checkIcon && typeof gsap !== 'undefined') {
                gsap.to(checkIcon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
}

// Reading progress bar
function addReadingProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', debounce(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(progressBar, {
                scaleX: progress / 100,
                duration: 0.1,
                ease: "none"
            });
        } else {
            progressBar.style.transform = `scaleX(${progress / 100})`;
        }
    }, 10));
}

// Intersection Observer for CSS fallback
function setupIntersectionObserver() {
    if (typeof gsap !== 'undefined') return; // Skip if GSAP is available
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all sections
    document.querySelectorAll('.story-section, .keyword-item, .tag-group, .faq-item, .pricing-tier, .result-item, .checklist-item').forEach(el => {
        observer.observe(el);
    });
}

// Utility function for debouncing
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

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Press 'b' to go back
    if (e.key === 'b' || e.key === 'B') {
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.click();
        }
    }
    
    // Press 'Escape' to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger any delayed animations
    if (typeof gsap !== 'undefined') {
        gsap.delayedCall(0.5, () => {
            // Any additional animations after page load
        });
    }
});

// Handle print styles
window.addEventListener('beforeprint', function() {
    // Simplify animations for print
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});

// Performance optimization: Reduce animations on low-end devices
if (navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
}

// Initialize resize handler for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Recalculate any position-dependent animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, 250));