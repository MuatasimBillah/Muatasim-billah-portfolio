// Wait for DOM content to load before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP 
    initGSAP();
    
    // Initialize Custom Cursor
    initCustomCursor();
    
    // Initialize Navigation and Mobile Menu
    initNavigation();
    
    // Initialize Typing Effect
    initTypingEffect();
    
    // Initialize Skill Progress Bars
    initSkillBars();
    
    // Initialize Project Filters
    initProjectFilters();
    
    // Initialize Testimonial Slider
    initTestimonials();
    
    // Initialize Contact Form
    initContactForm();
    
    // Initialize Back To Top button
    initBackToTop();
    
    // Initialize Theme Toggle
    initThemeToggle();
    
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
  });
  
  // Initialize GSAP animations
  function initGSAP() {
    if (typeof gsap === 'undefined') {
      console.error('GSAP is not loaded');
      return;
    }
    
    // Register ScrollTrigger plugin if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Hero section animations
      const heroElements = document.querySelectorAll('.hero-fade-in');
      gsap.fromTo(heroElements, {
        y: 50,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
      
      // Animate sections on scroll
      const sections = document.querySelectorAll('.section-reveal');
      sections.forEach(section => {
        gsap.fromTo(section, {
          y: 50,
          opacity: 0
        }, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleClass: {
              targets: section,
              className: 'active'
            }
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        });
      });
      
      // Animate progress bars when visible
      const skillBars = document.querySelectorAll('.skill-progress');
      skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        gsap.to(bar, {
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%'
          },
          width: width,
          duration: 1.5,
          ease: 'power3.out'
        });
      });
      
      // Animate skill cards
      const skillCards = document.querySelectorAll('.skill-card');
      skillCards.forEach((card, index) => {
        gsap.fromTo(card, {
          y: 50,
          opacity: 0
        }, {
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out'
        });
      });
      
      // Animate project cards
      const projectItems = document.querySelectorAll('.project-item');
      projectItems.forEach((item, index) => {
        gsap.fromTo(item, {
          y: 50,
          opacity: 0
        }, {
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out'
        });
      });
      
      // Animate service cards
      const serviceCards = document.querySelectorAll('.service-card');
      serviceCards.forEach((card, index) => {
        gsap.fromTo(card, {
          y: 50,
          opacity: 0
        }, {
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%'
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power3.out'
        });
      });
      
      // Animate contact form and info
      gsap.fromTo('.contact-info', {
        x: -50,
        opacity: 0
      }, {
        scrollTrigger: {
          trigger: '.contact-container',
          start: 'top 80%'
        },
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      });
      
      gsap.fromTo('.contact-form', {
        x: 50,
        opacity: 0
      }, {
        scrollTrigger: {
          trigger: '.contact-container',
          start: 'top 80%'
        },
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      });
    }
    
    // Blob animation for hero section
    gsap.to('.effect-blob', {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      duration: 20,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      repeatRefresh: true
    });
  }
  
  // Initialize custom cursor
  function initCustomCursor() {
    const cursor = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursor || !cursorOutline) return;
    
    // Applies only to desktop - no touch devices
    if (window.matchMedia("(min-width: 992px)").matches) {
      const moveCursor = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      };
      
      window.addEventListener('mousemove', moveCursor);
      
      // Interactive elements cursor effect
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .project-item, .skill-card, .service-card, .gallery-item');
      
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
    // Navbar scrolled effect
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;
    
    // Change navbar style on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
    
    // Check initial scroll position
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    }
    
    // Navigation active link updater
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveLink = () => {
      const scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .nav-link');
    
    const toggleMobileMenu = () => {
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    };
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileNavLinks.length > 0) {
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
      });
    }
  }
  
  // Initialize typing effect in hero section
  function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;
    
    const words = ['Shopify Design', 'Web Development', 'Ai talking Avatars', 'Ai Voice Overs', 'Canva Expert'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    let typeSpeed = 100;
    
    typingElement.classList.add('typing');
    
    const type = () => {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        // Remove a character
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        // Add a character
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
      }
      
      // Handle state changes
      if (!isDeleting && charIndex === currentWord.length) {
        // Finished typing the word
        isWaiting = true;
        typeSpeed = 2000; // Wait time at end of word
        isDeleting = true;
        setTimeout(() => {
          isWaiting = false;
          type();
        }, typeSpeed);
        return;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting the word
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
      
      // Continue typing/deleting if not waiting
      if (!isWaiting) {
        setTimeout(type, typeSpeed);
      }
    };
    
    setTimeout(type, 1000);
  }
  
  // Initialize skill bars
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
      const width = bar.getAttribute('data-width');
      setTimeout(() => {
        bar.style.width = width;
      }, 1000);
    });
  }
  
  // Initialize project filters
  function initProjectFilters() {
    const filters = document.querySelectorAll('.project-filter');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (filters.length === 0 || projectItems.length === 0) return;
    
    filters.forEach(filter => {
      filter.addEventListener('click', function() {
        // Update active filter
        filters.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        // Filter projects
        projectItems.forEach(item => {
          if (filterValue === 'all') {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 100);
          } else {
            const categories = item.getAttribute('data-categories').split(' ');
            if (categories.includes(filterValue)) {
              item.style.display = 'block';
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, 100);
            } else {
              item.style.opacity = '0';
              item.style.transform = 'translateY(20px)';
              setTimeout(() => {
                item.style.display = 'none';
              }, 300);
            }
          }
        });
      });
    });
  }
  
  // Initialize testimonial slider
  function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialIndicators = document.querySelectorAll('.testimonial-indicator');
    const prevButton = document.querySelector('.testimonial-arrow.prev');
    const nextButton = document.querySelector('.testimonial-arrow.next');
    
    if (testimonialCards.length === 0) return;
    
    let currentIndex = 0;
    
    const updateTestimonials = () => {
      testimonialCards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');
        
        if (index === currentIndex) {
          card.classList.add('active');
        } else if (index < currentIndex) {
          card.classList.add('prev');
        } else {
          card.classList.add('next');
        }
      });
      
      testimonialIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
      });
    };
    
    const goToTestimonial = (index) => {
      currentIndex = index;
      updateTestimonials();
    };
    
    const goToPrevTestimonial = () => {
      currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
      updateTestimonials();
    };
    
    const goToNextTestimonial = () => {
      currentIndex = (currentIndex + 1) % testimonialCards.length;
      updateTestimonials();
    };
    
    // Set up event listeners
    if (prevButton) {
      prevButton.addEventListener('click', goToPrevTestimonial);
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', goToNextTestimonial);
    }
    
    testimonialIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => goToTestimonial(index));
    });
    
    // Auto-play testimonials every 5 seconds
    let autoplayInterval = setInterval(goToNextTestimonial, 5000);
    
    // Pause autoplay on hover
    const testimonialContainer = document.querySelector('.testimonials-slider');
    if (testimonialContainer) {
      testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
      });
      
      testimonialContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(goToNextTestimonial, 5000);
      });
    }
    
    // Initialize
    updateTestimonials();
  }
  
  // Initialize contact form
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Basic validation
      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Simulate form submission - would be replaced with actual API call
      alert('Your message has been sent. Thank you!');
      contactForm.reset();
    });
  }
  
  // Initialize back to top button
  function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopButton.classList.add('active');
      } else {
        backToTopButton.classList.remove('active');
      }
    });
    
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Initialize theme toggle
  function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) return;
    
    // Check for saved theme preference or use default dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
      document.body.classList.add('light-theme');
      updateThemeIcon(true);
    }
    
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      const isLightTheme = document.body.classList.contains('light-theme');
      updateThemeIcon(isLightTheme);
      
      // Save theme preference
      localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    });
    
    function updateThemeIcon(isLightTheme) {
      const icon = themeToggle.querySelector('i');
      if (isLightTheme) {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    }
  }

  // Terms of Service JavaScript
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Update the current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set last updated date
    const lastUpdated = "March 27, 2023"; // Change this to your actual last update date
    document.querySelector('.update-date').textContent = lastUpdated;
    
    // Animate hero section
    gsap.to('.terms-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    });
    
    gsap.to('.terms-underline', {
      opacity: 1,
      scaleX: 1,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out'
    });
    
    gsap.to('.terms-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Setup navigation highlighting
    setupNavigation();
    
    // Initialize custom cursor if applicable
    if (window.initCustomCursor) {
      window.initCustomCursor();
    }
  });
  
  // Initialize scroll animations
  function initScrollAnimations() {
    // Animate all reveal elements
    const revealElements = document.querySelectorAll('.reveal-element');
    
    revealElements.forEach(el => {
      gsap.fromTo(el, 
        { 
          opacity: 0,
          y: 30 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });
    
    // Special animation for terms sections
    const termsSections = document.querySelectorAll('.terms-section');
    
    termsSections.forEach((section, index) => {
      // Animate section icon
      const icon = section.querySelector('.section-icon');
      
      if (icon) {
        gsap.fromTo(icon,
          {
            scale: 0,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
      
      // Animate section content with staggered effect
      const contentElements = section.querySelectorAll('h2, h3, p, ul');
      
      gsap.fromTo(contentElements,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    });
    
    // Animated background blobs
    gsap.to('.effect-blob', {
      x: "random(-20, 20)",
      y: "random(-20, 20)",
      duration: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      repeatRefresh: true
    });
  }
  
  // Setup navigation highlighting
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.terms-nav-link');
    const sections = document.querySelectorAll('.terms-section');
    
    // Highlight nav on scroll
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        
        if (href === current) {
          link.classList.add('active');
        }
      });
    });
    
    // Smooth scroll to section when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Remove active class from all links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to clicked link
          this.classList.add('active');
          
          // Calculate scroll position (accounting for fixed header)
          const headerHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          // Scroll to target section
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Highlight the section
          gsap.to(targetSection, {
            backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
            duration: 0.3,
            onComplete: () => {
              gsap.to(targetSection, {
                backgroundColor: 'rgba(var(--primary-rgb), 0)',
                duration: 1.5
              });
            }
          });
        }
      });
    });
    
    // Mobile navigation enhancements
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
      document.querySelector('.mobile-menu').classList.add('active');
    });
    
    document.querySelector('.mobile-close-btn').addEventListener('click', function() {
      document.querySelector('.mobile-menu').classList.remove('active');
    });
  }
  
  // Theme toggle functionality (if not already included in main.js)
  if (typeof initThemeToggle !== 'function') {
    function initThemeToggle() {
      const themeToggle = document.querySelector('.theme-toggle');
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Check for saved theme preference or use OS preference
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
      } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
      }
      
      // Toggle theme when button is clicked
      themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
          updateThemeIcon(false);
        } else {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
          updateThemeIcon(true);
        }
      });
      
      // Update theme icon
      function updateThemeIcon(isDarkMode) {
        const icon = themeToggle.querySelector('i');
        
        if (isDarkMode) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
    }
    
    // Initialize theme toggle
    initThemeToggle();
  }
  // Privacy Policy JavaScript
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Update the current year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set last updated date
    const lastUpdated = "March 27, 2023"; // Change this to your actual last update date
    document.querySelector('.update-date').textContent = lastUpdated;
    
    // Animate hero section
    gsap.to('.terms-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    });
    
    gsap.to('.terms-underline', {
      opacity: 1,
      scaleX: 1,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out'
    });
    
    gsap.to('.terms-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out'
    });
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Setup navigation highlighting
    setupNavigation();
    
    // Initialize custom cursor if applicable
    if (window.initCustomCursor) {
      window.initCustomCursor();
    }
  });
  
  // Initialize scroll animations
  function initScrollAnimations() {
    // Animate all reveal elements
    const revealElements = document.querySelectorAll('.reveal-element');
    
    revealElements.forEach(el => {
      gsap.fromTo(el, 
        { 
          opacity: 0,
          y: 30 
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });
    
    // Special animation for privacy sections
    const termsSections = document.querySelectorAll('.terms-section');
    
    termsSections.forEach((section, index) => {
      // Animate section icon
      const icon = section.querySelector('.section-icon');
      
      if (icon) {
        gsap.fromTo(icon,
          {
            scale: 0,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );
      }
      
      // Animate section content with staggered effect
      const contentElements = section.querySelectorAll('h2, h3, p, ul');
      
      gsap.fromTo(contentElements,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    });
    
    // Animated background blobs
    gsap.to('.effect-blob', {
      x: "random(-20, 20)",
      y: "random(-20, 20)",
      duration: 10,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      repeatRefresh: true
    });
  }
  
  // Setup navigation highlighting
  function setupNavigation() {
    const navLinks = document.querySelectorAll('.terms-nav-link');
    const sections = document.querySelectorAll('.terms-section');
    
    // Highlight nav on scroll
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        
        if (href === current) {
          link.classList.add('active');
        }
      });
    });
    
    // Smooth scroll to section when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          // Remove active class from all links
          navLinks.forEach(link => link.classList.remove('active'));
          
          // Add active class to clicked link
          this.classList.add('active');
          
          // Calculate scroll position (accounting for fixed header)
          const headerHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;
          
          // Scroll to target section
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Add a highlight animation to the target section
          gsap.to(targetSection, {
            backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
            duration: 0.3,
            onComplete: () => {
              gsap.to(targetSection, {
                backgroundColor: 'rgba(var(--primary-rgb), 0)',
                duration: 1.5
              });
            }
          });
        }
      });
    });
  }
  
  // Theme toggle functionality (if not already included in main.js)
  if (typeof initThemeToggle !== 'function') {
    function initThemeToggle() {
      const themeToggle = document.querySelector('.theme-toggle');
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Check for saved theme preference or use OS preference
      const savedTheme = localStorage.getItem('theme');
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(true);
      } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon(false);
      }
      
      // Toggle theme when button is clicked
      themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
          updateThemeIcon(false);
        } else {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
          updateThemeIcon(true);
        }
      });
      
      // Update theme icon
      function updateThemeIcon(isDarkMode) {
        const icon = themeToggle.querySelector('i');
        
        if (isDarkMode) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        } else {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
    }
    
    // Initialize theme toggle
    initThemeToggle();
  }
  