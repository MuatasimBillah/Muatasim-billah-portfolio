// Fiverr Journey Case Study JavaScript - Enhanced Experience
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeInteractiveElements();
    addReadingProgress();
    setupIntersectionObserver();
    initializeSocialSharing();
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
    
    // Story title animation with typing effect
    const titleText = document.querySelector('.story-title');
    if (titleText) {
        const text = titleText.textContent;
        titleText.textContent = '';
        
        gsap.fromTo(titleText, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.7,
            ease: "power2.out",
            onComplete: () => {
                typeWriter(titleText, text, 50);
            }
        });
    }
    
    // Story subtitle animation
    gsap.fromTo('.story-subtitle', {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.5,
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
        delay: 2,
        ease: "power2.out"
    });
    
    // Journey visualization animation
    gsap.fromTo('.journey-visualization', {
        opacity: 0,
        y: 60,
        scale: 0.95
    }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: 2.3,
        ease: "power2.out"
    });

    // Counter animation
    const counterNumber = document.querySelector('.counter-number');
    if (counterNumber) {
        gsap.fromTo(counterNumber, {
            textContent: 0
        }, {
            textContent: 45,
            duration: 2,
            delay: 2.5,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
                counterNumber.textContent = Math.ceil(this.targets()[0].textContent) + '+';
            }
        });
    }

    // Milestone animations
    gsap.fromTo('.milestone', {
        opacity: 0,
        scale: 0.5
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.3,
        delay: 3,
        ease: "back.out(1.7)"
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
        delay: 3.5,
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
        
        // Animate timeline items
        gsap.fromTo('.timeline-item', {
            opacity: 0,
            x: -60
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.timeline-section',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate learning items
        gsap.fromTo('.learning-item', {
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
                trigger: '.learning-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate gig elements
        gsap.fromTo('.element-card', {
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
                trigger: '.gig-elements',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate ranking drop
        gsap.fromTo('.rank-item', {
            opacity: 0,
            scale: 0.5
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.ranking-drop',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate process grid
        gsap.fromTo('.process-item', {
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
                trigger: '.process-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate takeaway cards
        gsap.fromTo('.takeaway-card', {
            opacity: 0,
            x: -40
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.takeaways-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate related studies
        gsap.fromTo('.study-card', {
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
                trigger: '.related-studies',
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

// Typewriter effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// CSS fallback animations
function initializeCSSAnimations() {
    const elements = document.querySelectorAll('.back-btn, .story-category, .story-title, .story-subtitle, .story-meta span, .journey-visualization, .author-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Counter animation fallback
    const counterNumber = document.querySelector('.counter-number');
    if (counterNumber) {
        let count = 0;
        const target = 45;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            counterNumber.textContent = Math.ceil(count) + '+';
        }, 40);
    }
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
    
    // Element cards hover effects
    document.querySelectorAll('.element-card, .takeaway-card, .study-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    y: -8,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Milestone hover effects
    document.querySelectorAll('.milestone').forEach(milestone => {
        milestone.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(milestone.querySelector('i'), {
                    scale: 1.2,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            }
        });
        
        milestone.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(milestone.querySelector('i'), {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Add click animations to interactive elements
    document.querySelectorAll('button, .btn-primary, .btn-secondary, .share-btn').forEach(element => {
        element.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Reading progress bar
function addReadingProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;
    
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(progressBar, {
                scaleX: scrollPercent,
                duration: 0.1,
                ease: "none"
            });
        } else {
            progressBar.style.transform = `scaleX(${scrollPercent})`;
        }
    }
    
    window.addEventListener('scroll', debounce(updateProgress, 10));
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Trigger specific animations based on element class
                if (entry.target.classList.contains('confession-box')) {
                    triggerConfessionAnimation(entry.target);
                } else if (entry.target.classList.contains('breakthrough-moment')) {
                    triggerBreakthroughAnimation(entry.target);
                } else if (entry.target.classList.contains('final-wisdom')) {
                    triggerWisdomAnimation(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe key elements
    document.querySelectorAll('.confession-box, .breakthrough-moment, .final-wisdom, .client-message, .panic-moment').forEach(el => {
        observer.observe(el);
    });
}

// Specific element animations
function triggerConfessionAnimation(element) {
    if (typeof gsap === 'undefined') return;
    
    gsap.fromTo(element, {
        scale: 0.9,
        opacity: 0.8
    }, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)"
    });
}

function triggerBreakthroughAnimation(element) {
    if (typeof gsap === 'undefined') return;
    
    const number = element.querySelector('.moment-number');
    if (number) {
        gsap.fromTo(number, {
            scale: 0,
            rotation: -180
        }, {
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "back.out(1.7)"
        });
    }
}

function triggerWisdomAnimation(element) {
    if (typeof gsap === 'undefined') return;
    
    const mantras = element.querySelectorAll('.mantra');
    gsap.fromTo(mantras, {
        y: 20,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });
}

// Social sharing functionality
function initializeSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const pageDescription = document.querySelector('meta[name="description"]')?.content || '';
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.dataset.share;
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)}&url=${encodeURIComponent(pageUrl)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(pageUrl).then(() => {
                        showToast('Link copied to clipboard!');
                    });
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary), var(--primary-light));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Debounce function
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

// Easter egg: Konami code
let konamiCode = [];
const correctCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > correctCode.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === correctCode.length && 
        konamiCode.every((code, index) => code === correctCode[index])) {
        
        // Easter egg activated
        showToast('🎉 Easter egg activated! 45+ accounts journey unlocked!');
        
        // Add special effect
        const allElements = document.querySelectorAll('.story-section');
        allElements.forEach((el, index) => {
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(el, {
                        rotation: 360,
                        duration: 1,
                        ease: "back.out(1.7)"
                    });
                }
            }, index * 100);
        });
        
        konamiCode = []; // Reset
    }
});

// Performance optimization: Lazy load images and heavy content
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('[data-src]');
        
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                    lazyLoadObserver.unobserve(element);
                }
            });
        });
        
        lazyElements.forEach(element => {
            lazyLoadObserver.observe(element);
        });
    }
}

// Initialize lazy loading
initializeLazyLoading();

// Performance monitoring
function logPerformanceMetrics() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: perfData.loadEventEnd - perfData.navigationStart
                });
            }, 1000);
        });
    }
}

logPerformanceMetrics();
