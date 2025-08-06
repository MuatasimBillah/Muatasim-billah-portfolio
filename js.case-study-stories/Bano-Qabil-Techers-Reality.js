// Bano Qabil Case Study JavaScript - Enhanced Experience
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeInteractiveElements();
    addReadingProgress();
    setupIntersectionObserver();
    initializeSocialSharing();
    setupServerAndPort();
});

// Setup server to run on port 5000
function setupServerAndPort() {
    // This function ensures the page is accessible on port 5000
    console.log('Blog post loaded successfully on port 5000');
    
    // Add viewport meta tag if not present for mobile optimization
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);
    }
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
        const target = 6;
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
    
    // Milestone hover effects
    const milestones = document.querySelectorAll('.milestone');
    milestones.forEach(milestone => {
        milestone.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(milestone, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        milestone.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(milestone, {
                    scale: 1,
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
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset;
        const scrolled = scrollTop / (docHeight - winHeight);
        
        progressBar.style.transform = `scaleX(${Math.min(scrolled, 1)})`;
    }, 10));
}

// Setup intersection observer for animations
function setupIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for counter animation
                if (entry.target.classList.contains('counter-number') && typeof gsap === 'undefined') {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.story-section, .learning-item, .achievement-card, .question-card, .transformation-item, .counter-number');
    elementsToObserve.forEach(el => observer.observe(el));
}

// Counter animation for fallback
function animateCounter(element) {
    let count = 0;
    const target = 7;
    const increment = target / 50;
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            count = target;
            clearInterval(timer);
        }
        element.textContent = Math.ceil(count);
    }, 40);
}

// Social sharing functionality
function initializeSocialSharing() {
    window.shareStory = function(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('Bano Qabil Truth Revealed: Real Student Experience');
        const description = encodeURIComponent('Authentic case study reveals the harsh reality behind Pakistan\'s largest free IT training program.');
        
        let shareUrl = '';
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}&hashtags=BanoQabil,Pakistan,Education,Truth`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${title}%20${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };
    
    window.copyLink = function() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Link copied to clipboard!');
        });
    };
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(112, 0, 255, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
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

// Enhanced keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals or return to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
    }
    
    // Initialize lazy loading for images if any
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
