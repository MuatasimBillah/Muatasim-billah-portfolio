// DOM Elements
let filterTabs;
let serviceCards;
let mobileMenu;
let mobileCloseBtn;
let themeToggle;
let navbar;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements after page loads
    filterTabs = document.querySelectorAll('.filter-tab');
    serviceCards = document.querySelectorAll('.service-card');
    mobileMenu = document.querySelector('.mobile-menu');
    mobileCloseBtn = document.querySelector('.mobile-close-btn');
    themeToggle = document.querySelector('.theme-toggle');
    navbar = document.querySelector('.navbar');

    // Initialize all features
    initializeAnimations();
    initializeFilters();
    initializeMobileMenu();
    initializeThemeToggle();
    initializeServiceCards();
    initializeScrollEffects();
    
    console.log('Services page initialized successfully');
});

// Initialize animations
function initializeAnimations() {
    // Add initial animation to service cards
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150 + 300);
    });

    // Page header animation
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        pageHeader.style.opacity = '0';
        pageHeader.style.transform = 'translateY(30px)';
        setTimeout(() => {
            pageHeader.style.transition = 'all 0.6s ease';
            pageHeader.style.opacity = '1';
            pageHeader.style.transform = 'translateY(0)';
        }, 100);
    }

    // Filter section animation
    const filterSection = document.querySelector('.filter-section');
    if (filterSection) {
        filterSection.style.opacity = '0';
        filterSection.style.transform = 'translateY(20px)';
        setTimeout(() => {
            filterSection.style.transition = 'all 0.6s ease';
            filterSection.style.opacity = '1';
            filterSection.style.transform = 'translateY(0)';
        }, 200);
    }
}

// Filter functionality - FIXED VERSION
function initializeFilters() {
    if (!filterTabs || filterTabs.length === 0) {
        console.warn('Filter tabs not found');
        return;
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log('Filter clicked:', category);
            
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter services
            filterServices(category);
        });
    });
}

function filterServices(category) {
    if (!serviceCards || serviceCards.length === 0) {
        console.warn('Service cards not found');
        return;
    }

    let visibleCount = 0;
    
    serviceCards.forEach((card, index) => {
        const cardCategory = card.getAttribute('data-category');
        let shouldShow = false;
        
        if (category === 'all') {
            shouldShow = true;
        } else {
            // Check if card category contains the filter category
            if (cardCategory && cardCategory.includes(category)) {
                shouldShow = true;
            }
        }
        
        if (shouldShow) {
            visibleCount++;
            // Show card with animation
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        } else {
            // Hide card with animation
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px) scale(0.95)';
            
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    console.log(`Showing ${visibleCount} services for category: ${category}`);
    
    // Update grid layout after filtering
    setTimeout(() => {
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.style.animation = 'none';
            servicesGrid.offsetHeight; // Trigger reflow
            servicesGrid.style.animation = 'fadeIn 0.5s ease';
        }
    }, 400);
}

// Mobile menu functionality
function initializeMobileMenu() {
    // Create mobile menu button
    const nav = document.querySelector('.navbar nav');
    if (nav && !document.querySelector('.mobile-menu-btn')) {
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-label', 'Open menu');
        menuBtn.style.cssText = `
            display: none;
            background: var(--card-dark);
            border: 1px solid var(--border-color);
            color: var(--text-light);
            padding: 0.75rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: var(--transition);
        `;
        
        // Add responsive display
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-btn { display: block !important; }
                .desktop-nav { display: none !important; }
            }
        `;
        document.head.appendChild(style);
        
        nav.appendChild(menuBtn);
        
        menuBtn.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }
    
    // Close mobile menu
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu when clicking outside
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
}

function closeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Theme toggle functionality
function initializeThemeToggle() {
    if (!themeToggle) return;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Service card interactions
function initializeServiceCards() {
    serviceCards.forEach((card, index) => {
        const exploreBtn = card.querySelector('.btn-explore');
        const serviceTitle = card.querySelector('.service-title')?.textContent;
        
        // Add click handler for "View Gig" buttons
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleViewGig(serviceTitle, exploreBtn);
            });
        }
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.boxShadow = '0 25px 50px rgba(112, 0, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '';
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

function handleViewGig(serviceTitle, button) {
    if (!button || !serviceTitle) return;
    
    // Add loading state
    const originalText = button.textContent;
    const originalHTML = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    button.style.pointerEvents = 'none';
    
    // Simulate loading and redirect to Fiverr
    setTimeout(() => {
        // Reset button state
        button.innerHTML = originalHTML;
        button.disabled = false;
        button.style.pointerEvents = 'auto';
        
        // Define Fiverr URLs for each service
        const fiverrUrls = {
            'Shopify Store Designing': 'https://www.fiverr.com/mehar_ai_studio/create-professional-shopify-store',
            'Frontend Website Designing': 'https://www.fiverr.com/mehar_ai_studio/design-modern-frontend-website',
            'AI Talking Avatars': 'https://www.fiverr.com/mehar_ai_studio/create-ai-talking-avatar',
            'Canva Expert Services': 'https://www.fiverr.com/mehar_ai_studio/design-graphics-with-canva',
            'AI Voice Over Services': 'https://www.fiverr.com/mehar_ai_studio/create-ai-voice-over',
            'Audio Engineering': 'https://www.fiverr.com/mehar_ai_studio/mix-master-audio'
        };
        
        const url = fiverrUrls[serviceTitle] || 'https://www.fiverr.com/mehar_ai_studio?public_mode=true';
        
        // Open in new tab
        window.open(url, '_blank', 'noopener,noreferrer');
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_gig_click', {
                'service_name': serviceTitle,
                'button_location': 'services_page',
                'fiverr_url': url
            });
        }
        
        console.log('Redirecting to:', url);
        
    }, 800);
}

// Create ripple effect
function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(112, 0, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1;
    `;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Scroll effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (navbar) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.opacity = '0.95';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
                navbar.style.opacity = '1';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('Page fully loaded');
    
    // Initialize intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
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
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach((img, index) => {
        img.addEventListener('error', function() {
            console.warn('Image failed to load:', this.src);
            this.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="300" fill="#1a1a24"/>
                    <rect x="150" y="120" width="100" height="60" rx="8" fill="#2a2a3a"/>
                    <circle cx="170" cy="140" r="8" fill="#7000ff"/>
                    <path d="M180 150 L190 140 L200 150 L190 160 Z" fill="#7000ff"/>
                    <text x="200" y="180" font-family="Arial" font-size="14" fill="#b0b3c1" text-anchor="middle">Service Image</text>
                </svg>
            `)}`;
            this.style.opacity = '0.8';
        });
        
        // Add loading state
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .loaded {
        opacity: 1;
    }
    
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        }, 0);
    });
}

// Debug mode
const isDebug = new URLSearchParams(window.location.search).has('debug');
if (isDebug) {
    console.log('Debug mode enabled');
    window.servicesDebug = {
        filterTabs,
        serviceCards,
        filterServices,
        handleViewGig
    };
}