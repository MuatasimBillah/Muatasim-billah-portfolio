// Bano Qabil Case Study JavaScript - Enhanced Experience
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeInteractiveElements();
    addReadingProgress();
    initializeFAQ();
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
            textContent: 7,
            duration: 2,
            delay: 2.5,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
                counterNumber.textContent = Math.ceil(this.targets()[0].textContent);
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
        
        // Animate achievement cards
        gsap.fromTo('.achievement-card', {
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
                trigger: '.achievement-cards',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate ceremony timeline
        gsap.fromTo('.ceremony-item', {
            opacity: 0,
            scale: 0.5
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.ceremony-timeline',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate questions grid
        gsap.fromTo('.question-card', {
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
                trigger: '.questions-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
        
        // Animate transformation grid
        gsap.fromTo('.transformation-item', {
            opacity: 0,
            x: -40
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.transformation-grid',
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
        const target = 7;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            counterNumber.textContent = Math.ceil(count);
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
    
    // Card hover effects
    const cards = document.querySelectorAll('.learning-item, .achievement-card, .question-card, .transformation-item');
    cards.forEach(card => {
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
    
    // CTA button effects
    const ctaButtons = document.querySelectorAll('.cta-btn');
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
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-btn, .back-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

// Reading progress
function addReadingProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const story = document.querySelector('.story-content');
    
    if (!progressBar || !story) return;
    
    window.addEventListener('scroll', debounce(() => {
        const storyTop = story.offsetTop;
        const storyHeight = story.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        const start = storyTop - windowHeight;
        const end = storyTop + storyHeight;
        
        if (scrollTop >= start && scrollTop <= end) {
            const progress = (scrollTop - start) / (end - start);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            
            if (typeof gsap !== 'undefined') {
                gsap.to(progressBar, {
                    scaleX: clampedProgress,
                    duration: 0.1,
                    ease: "none"
                });
            } else {
                progressBar.style.transform = `scaleX(${clampedProgress})`;
            }
        } else if (scrollTop < start) {
            if (typeof gsap !== 'undefined') {
                gsap.to(progressBar, {
                    scaleX: 0,
                    duration: 0.1,
                    ease: "none"
                });
            } else {
                progressBar.style.transform = 'scaleX(0)';
            }
        } else {
            if (typeof gsap !== 'undefined') {
                gsap.to(progressBar, {
                    scaleX: 1,
                    duration: 0.1,
                    ease: "none"
                });
            } else {
                progressBar.style.transform = 'scaleX(1)';
            }
        }
    }, 10));
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        return; // GSAP ScrollTrigger handles this
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe story sections
    const sections = document.querySelectorAll('.story-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
}

// Social sharing
function initializeSocialSharing() {
    const shareBtn = document.querySelector('.cta-btn.secondary');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const url = window.location.href;
            const title = document.title;
            const text = 'Bano Qabil ka Chhupa Sach - Izzat se Zillat Tak ka Safar';
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: text,
                    url: url
                }).catch(console.error);
            } else {
                // Fallback to copying URL
                navigator.clipboard.writeText(url).then(() => {
                    showToast('Link copied to clipboard!');
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('Link copied to clipboard!');
                });
            }
        });
    }
}

// FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
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

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not exist
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        z-index: 10000;
        font-size: 0.9rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: slideInUp 0.3s ease-out forwards;
    `;
    
    // Add toast animation keyframes if not exist
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.textContent = `
            @keyframes slideInUp {
                from {
                    transform: translateY(100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutDown {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(100px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease-out forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume animations if needed
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.play();
        }
    } else {
        // Pause animations to save performance
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    }
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}, 250));

// Preload critical assets
function preloadAssets() {
    const criticalImages = [
        // Add any critical images here
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadAssets);
} else {
    preloadAssets();
}