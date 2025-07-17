/**
 * Enhanced Navbar with Improved Mobile Menu - Fixed Double-Click Issue
 * Modern, conflict-free implementation
 */

class ModernNavbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.body = document.body;
        this.isMenuOpen = false;
        this.activeDropdowns = new Set();
        this.isInitialized = false;
        
        // Throttle scroll events
        this.scrollThrottled = this.throttle(this.handleScroll.bind(this), 16);
        
        if (this.navbar) {
            this.init();
        }
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.bindScrollEvents();
        this.initDesktopDropdowns();
        this.initMobileMenu();
        this.initMobileAccordions();
        this.bindGlobalEvents();
        
        this.isInitialized = true;
        console.log('Modern navbar initialized successfully');
    }
    
    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    bindScrollEvents() {
        // Handle navbar scroll effect
        window.addEventListener('scroll', this.scrollThrottled, { passive: true });
        
        // Set initial state
        this.handleScroll();
    }
    
    handleScroll() {
        const scrolled = window.scrollY > 50;
        this.navbar?.classList.toggle('scrolled', scrolled);
    }
    
    bindGlobalEvents() {
        // Close dropdowns/menu when clicking outside
        document.addEventListener('click', (e) => this.handleGlobalClick(e), true);
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    initDesktopDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            if (dropdown.hasAttribute('data-dropdown-bound')) return;
            
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!trigger || !menu) return;
            
            let hoverTimeout;
            
            // Mouse events
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                this.showDropdown(dropdown);
            });
            
            dropdown.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    this.hideDropdown(dropdown);
                }, 150);
            });
            
            // Keyboard events
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleDropdown(dropdown);
                }
                if (e.key === 'Escape') {
                    this.hideDropdown(dropdown);
                }
            });
            
            dropdown.setAttribute('data-dropdown-bound', 'true');
        });
    }
    
    initMobileMenu() {
        if (!this.mobileMenuBtn) return;
        
        // Remove any existing event listeners
        if (this.mobileMenuBtn.hasAttribute('data-mobile-bound')) return;
        
        // Single event listener with immediate response
        this.mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenuImmediate();
        }, { passive: false });
        
        // Touch events for mobile
        this.mobileMenuBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenuImmediate();
        }, { passive: false });
        
        // Close menu when clicking overlay
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target === this.mobileMenu) {
                    this.closeMobileMenu();
                }
            });
        }
        
        this.mobileMenuBtn.setAttribute('data-mobile-bound', 'true');
    }
    
    toggleMobileMenuImmediate() {
        // Immediate toggle without any delays
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }
    
    openMobileMenu() {
        if (this.isMenuOpen) return;
        
        this.isMenuOpen = true;
        this.mobileMenu?.classList.add('active');
        this.mobileMenuBtn?.classList.add('active');
        this.body.classList.add('menu-open');
        
        // Close any open dropdowns
        this.closeAllDropdowns();
        
        // Focus first menu item after animation
        requestAnimationFrame(() => {
            const firstItem = this.mobileMenu?.querySelector('.mobile-nav-link, .mobile-dropdown-trigger');
            firstItem?.focus();
        });
    }
    
    closeMobileMenu() {
        if (!this.isMenuOpen) return;
        
        this.isMenuOpen = false;
        this.mobileMenu?.classList.remove('active');
        this.mobileMenuBtn?.classList.remove('active');
        this.body.classList.remove('menu-open');
        
        // Close all mobile accordions
        this.closeAllMobileAccordions();
    }
    
    initMobileAccordions() {
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        
        mobileDropdowns.forEach(dropdown => {
            if (dropdown.hasAttribute('data-accordion-bound')) return;
            
            const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
            const content = dropdown.querySelector('.mobile-dropdown-content');
            
            if (!trigger || !content) return;
            
            // Click events
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileAccordion(dropdown);
            });
            
            // Touch events
            trigger.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileAccordion(dropdown);
            });
            
            // Keyboard events
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileAccordion(dropdown);
                }
            });
            
            dropdown.setAttribute('data-accordion-bound', 'true');
        });
    }
    
    toggleMobileAccordion(dropdown) {
        const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
        const content = dropdown.querySelector('.mobile-dropdown-content');
        const isActive = trigger?.classList.contains('active');
        
        if (isActive) {
            this.closeMobileAccordion(dropdown);
        } else {
            // Close other accordions
            this.closeAllMobileAccordions();
            this.openMobileAccordion(dropdown);
        }
    }
    
    openMobileAccordion(dropdown) {
        const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
        const content = dropdown.querySelector('.mobile-dropdown-content');
        
        trigger?.classList.add('active');
        content?.classList.add('active');
        
        // Update ARIA
        trigger?.setAttribute('aria-expanded', 'true');
    }
    
    closeMobileAccordion(dropdown) {
        const trigger = dropdown.querySelector('.mobile-dropdown-trigger');
        const content = dropdown.querySelector('.mobile-dropdown-content');
        
        trigger?.classList.remove('active');
        content?.classList.remove('active');
        
        // Update ARIA
        trigger?.setAttribute('aria-expanded', 'false');
    }
    
    closeAllMobileAccordions() {
        const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
        mobileDropdowns.forEach(dropdown => {
            this.closeMobileAccordion(dropdown);
        });
    }
    
    showDropdown(dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        const trigger = dropdown.querySelector('.dropdown-trigger');
        
        if (!menu) return;
        
        // Close other dropdowns
        this.closeOtherDropdowns(dropdown);
        
        // Show menu
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateX(-50%) translateY(0) scale(1)';
        
        this.activeDropdowns.add(dropdown);
        
        // Update ARIA
        trigger?.setAttribute('aria-expanded', 'true');
    }
    
    hideDropdown(dropdown) {
        const menu = dropdown.querySelector('.dropdown-menu');
        const trigger = dropdown.querySelector('.dropdown-trigger');
        
        if (!menu) return;
        
        // Hide menu
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(-15px) scale(0.95)';
        
        this.activeDropdowns.delete(dropdown);
        
        // Update ARIA
        trigger?.setAttribute('aria-expanded', 'false');
    }
    
    toggleDropdown(dropdown) {
        if (this.activeDropdowns.has(dropdown)) {
            this.hideDropdown(dropdown);
        } else {
            this.showDropdown(dropdown);
        }
    }
    
    closeOtherDropdowns(currentDropdown) {
        this.activeDropdowns.forEach(dropdown => {
            if (dropdown !== currentDropdown) {
                this.hideDropdown(dropdown);
            }
        });
    }
    
    closeAllDropdowns() {
        this.activeDropdowns.forEach(dropdown => {
            this.hideDropdown(dropdown);
        });
    }
    
    handleGlobalClick(e) {
        // Check if click is inside any dropdown
        const isInsideDropdown = e.target.closest('.nav-dropdown');
        const isInsideMobileMenu = e.target.closest('.mobile-menu');
        const isMobileMenuBtn = e.target.closest('.mobile-menu-btn');
        
        // Close dropdowns if clicking outside
        if (!isInsideDropdown) {
            this.closeAllDropdowns();
        }
        
        // Close mobile menu if clicking outside
        if (!isInsideMobileMenu && !isMobileMenuBtn && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    handleResize() {
        const isMobile = window.innerWidth <= 992;
        
        if (!isMobile && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        if (isMobile) {
            this.closeAllDropdowns();
        }
    }
    
    // Public API methods
    openMenu() {
        this.openMobileMenu();
    }
    
    closeMenu() {
        this.closeMobileMenu();
    }
    
    toggleMenu() {
        this.toggleMobileMenuImmediate();
    }
    
    destroy() {
        // Clean up event listeners
        window.removeEventListener('scroll', this.scrollThrottled);
        document.removeEventListener('click', this.handleGlobalClick);
        
        // Remove classes
        this.body.classList.remove('menu-open');
        this.mobileMenu?.classList.remove('active');
        this.mobileMenuBtn?.classList.remove('active');
        
        // Close everything
        this.closeAllDropdowns();
        this.closeAllMobileAccordions();
        
        // Reset state
        this.isMenuOpen = false;
        this.isInitialized = false;
        
        // Remove bound attributes
        document.querySelectorAll('[data-dropdown-bound]').forEach(el => {
            el.removeAttribute('data-dropdown-bound');
        });
        
        document.querySelectorAll('[data-accordion-bound]').forEach(el => {
            el.removeAttribute('data-accordion-bound');
        });
        
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.removeAttribute('data-mobile-bound');
        }
    }
}

// Initialize function
function initModernNavbar() {
    // Prevent multiple initializations
    if (window.modernNavbarInstance) {
        return;
    }
    
    // Check if navbar exists
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }
    
    // Create instance
    window.modernNavbarInstance = new ModernNavbar();
    
    console.log('Modern navbar system loaded');
}

// Multiple initialization strategies for maximum compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModernNavbar);
} else {
    initModernNavbar();
}

// Fallback initialization
setTimeout(initModernNavbar, 50);

// Additional safety initialization
window.addEventListener('load', initModernNavbar);

// Global access
window.initModernNavbar = initModernNavbar;
window.ModernNavbar = ModernNavbar;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernNavbar;
}