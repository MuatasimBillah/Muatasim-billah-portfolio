// Wait for DOM content to load before initializing
document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP if available
  if (typeof gsap !== 'undefined') {
    initGSAP();
  }
  
  // Initialize Custom Cursor
  initCustomCursor();
  
  // Initialize Navigation
  initNavigation();
  
  // Initialize Search and Filter
  initSearchAndFilter();
  
  // Initialize Back To Top button
  initBackToTop();
  
  // Initialize animations on scroll
  initScrollAnimations();
});

// Initialize GSAP animations
function initGSAP() {
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Page header animations
    gsap.fromTo('.page-header', {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    });
    
    // Tool cards animation
    gsap.fromTo('.tool-card', {
      y: 50,
      opacity: 0
    }, {
      scrollTrigger: {
        trigger: '.tools-grid',
        start: 'top 80%'
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
    
    // Stats section animation
    gsap.fromTo('.stat-card', {
      y: 30,
      opacity: 0
    }, {
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%'
      },
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
    
    // Controls animation
    gsap.fromTo('.tools-controls', {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out'
    });
  }
}

// Initialize custom cursor
function initCustomCursor() {
  const cursor = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  if (!cursor || !cursorOutline) return;
  
  // Only for desktop - no touch devices
  if (window.matchMedia("(min-width: 992px)").matches && !('ontouchstart' in window)) {
    const moveCursor = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };
    
    window.addEventListener('mousemove', moveCursor);
    
    // Interactive elements cursor effect
    const interactiveElements = document.querySelectorAll('a, button, input, .tool-card, .filter-pill, .stat-card');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(0.75)";
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
        cursorOutline.style.borderColor = "var(--primary)";
        cursorOutline.style.backgroundColor = "rgba(112, 0, 255, 0.1)";
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
        cursorOutline.style.borderColor = "var(--primary)";
        cursorOutline.style.backgroundColor = "transparent";
      });
    });
  }
}

// Initialize navigation
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .nav-link');
  
  // Navbar scrolled effect
  const scrollThreshold = 50;
  
  const updateNavbar = () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  
  window.addEventListener('scroll', updateNavbar);
  updateNavbar(); // Check initial scroll position
  
  // Mobile menu toggle
  const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  };
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking on links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
  });
  
  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
}

// Initialize search and filter functionality
function initSearchAndFilter() {
  const searchInput = document.getElementById('searchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const toolCards = document.querySelectorAll('.tool-card');
  const noResults = document.getElementById('noResults');
  
  let currentFilter = 'all';
  let currentSearch = '';
  
  // Filter tools based on search and category
  const filterTools = () => {
    let visibleCount = 0;
    
    toolCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.tool-title').textContent.toLowerCase();
      const description = card.querySelector('.tool-description').textContent.toLowerCase();
      
      const matchesFilter = currentFilter === 'all' || category === currentFilter;
      const matchesSearch = currentSearch === '' || 
                           title.includes(currentSearch.toLowerCase()) || 
                           description.includes(currentSearch.toLowerCase()) ||
                           category.includes(currentSearch.toLowerCase());
      
      if (matchesFilter && matchesSearch) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, visibleCount * 50);
        
        visibleCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
      noResults.style.display = 'block';
      noResults.style.opacity = '0';
      setTimeout(() => {
        noResults.style.opacity = '1';
      }, 300);
    } else {
      noResults.style.opacity = '0';
      setTimeout(() => {
        noResults.style.display = 'none';
      }, 300);
    }
  };
  
  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      filterTools();
    });
  }
  
  // Filter pills handler
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active pill
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Update current filter
      currentFilter = pill.getAttribute('data-category');
      filterTools();
    });
  });
  
  // Initial filter
  filterTools();
}

// Initialize back to top button
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  
  if (!backToTopBtn) return;
  
  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };
  
  window.addEventListener('scroll', toggleBackToTop);
  toggleBackToTop(); // Check initial scroll position
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize scroll animations for elements without GSAP
function initScrollAnimations() {
  if (typeof gsap !== 'undefined') return; // Skip if GSAP is available
  
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.tool-card, .stat-card, .page-header');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Set initial styles for animation
  const elements = document.querySelectorAll('.tool-card, .stat-card');
  elements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Check initial scroll position
}

// Utility function to add click analytics (optional)
function trackToolClick(toolName) {
  // Add your analytics tracking code here
  console.log(`Tool clicked: ${toolName}`);
  
  // Example: Google Analytics event tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'tool_click', {
      'tool_name': toolName,
      'event_category': 'tools',
      'event_label': toolName
    });
  }
}

// Add click tracking to tool cards
document.addEventListener('DOMContentLoaded', () => {
  const toolLinks = document.querySelectorAll('.tool-link');
  
  toolLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const toolCard = e.target.closest('.tool-card');
      const toolName = toolCard.querySelector('.tool-title').textContent;
      trackToolClick(toolName);
    });
  });
});

// Performance optimization: Debounced scroll handler
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

// Use debounced scroll for performance
const debouncedScroll = debounce(() => {
  // Any scroll-based functions can be called here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
  // Add keyboard navigation support
  const interactiveElements = document.querySelectorAll('button, a, input');
  
  interactiveElements.forEach(element => {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (element.tagName !== 'INPUT') {
          e.preventDefault();
          element.click();
        }
      }
    });
  });
  
  // Add focus styles for keyboard navigation
  const style = document.createElement('style');
  style.textContent = `
    *:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
    
    button:focus,
    a:focus,
    input:focus {
      box-shadow: 0 0 0 3px rgba(112, 0, 255, 0.3);
    }
  `;
  document.head.appendChild(style);
});

// Preload critical resources
function preloadCriticalResources() {
  // Preload fonts if not already loaded
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'
  ];
  
  fonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    document.head.appendChild(link);
  });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadCriticalResources);