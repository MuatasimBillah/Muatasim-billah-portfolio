// Hardest Project Story JavaScript - Enhanced Experience
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeInteractiveElements();
    addReadingProgress();
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
        
        // Animate challenge items
        gsap.fromTo('.challenge-item', {
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
                trigger: '.challenge-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate execution steps
        gsap.fromTo('.step', {
            opacity: 0,
            x: -60
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.execution-steps',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate outcome items
        gsap.fromTo('.outcome-item', {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.outcome-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate lessons
        gsap.fromTo('.lesson', {
            opacity: 0,
            y: 40,
            rotationY: 15
        }, {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.lessons-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate inspiration points
        gsap.fromTo('.inspiration-item', {
            opacity: 0,
            y: 50,
            scale: 0.9
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.inspiration-points',
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
    const elements = document.querySelectorAll('.back-btn, .story-category, .story-title, .story-subtitle, .story-meta span, .story-image');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Intersection observer for sections
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
    
    document.querySelectorAll('.story-section, .challenge-item, .step, .outcome-item, .lesson, .inspiration-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
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
    }, 10);
    
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
    
    // CTA button hover effect
    const ctaBtn = document.querySelector('.btn-primary');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(ctaBtn, {
                    y: -5,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        ctaBtn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(ctaBtn, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    }
    
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
    
    // Challenge items hover effect
    document.querySelectorAll('.challenge-item').forEach(item => {
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
    
    // Outcome items celebration effect
    document.querySelectorAll('.outcome-item.success').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item, {
                    y: -10,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
                
                // Particle effect simulation
                const icon = item.querySelector('i');
                if (icon) {
                    gsap.to(icon, {
                        rotation: 360,
                        duration: 0.5,
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
                        rotation: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            }
        });
    });
}

// Reading progress indicator
function addReadingProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #7000ff 0%, #9a4eff 100%);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = Math.min(progress, 100) + '%';
    });
}

// Utility functions
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

// Add motivational quote animation
function animateMotivationalQuotes() {
    const quotes = document.querySelectorAll('.motivation-quote, .personal-quote');
    
    quotes.forEach(quote => {
        quote.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(quote, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        quote.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(quote, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
}

// Initialize quote animations
setTimeout(animateMotivationalQuotes, 1000);

// Add typing effect to key messages
function addTypingEffect() {
    const keyMessages = document.querySelectorAll('.my-promise p, .my-response p');
    
    keyMessages.forEach(message => {
        const originalText = message.textContent;
        message.textContent = '';
        
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < originalText.length) {
                message.textContent += originalText.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    });
}

// Intersection observer for typing effect
const typingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            addTypingEffect();
            typingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.my-promise, .my-response').forEach(element => {
    typingObserver.observe(element);
});

// Export for external use
window.HardestProjectJS = {
    initializeAnimations,
    animateBackgroundBlobs,
    addReadingProgress
};