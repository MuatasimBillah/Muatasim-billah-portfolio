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
// ----------------------
// KNOWLEDGE BASE
// ----------------------

// Enhanced AI knowledge base with comprehensive information
const knowledgeBase = {
  "introduction": {
    response: "Hello! I'm the AI assistant for Muatasim Billah's portfolio. How can I assist you today?",
    followUp: false
  },
  
  "feelings": {
    response: "I'm just an AI assistant, so I don't have feelings. But I'm here to help you learn more about Muatasim Billah's services and portfolio. How can I assist you?",
    followUp: false
  },
  
  "creator": {
    response: "Muatasim Billah is my creator and the owner of this portfolio. He's an expert in Shopify Store Design, Frontend Web Development, AI Talking Avatars, Canva Design, AI Voice Overs, and Audio Engineering.",
    followUp: "Would you like to learn more about any of these services?"
  },
  
  "ceo": {
    response: "Muatasim Billah is the CEO and founder of this business. He personally handles all client projects and specializes in multiple digital services.",
    followUp: "Can I tell you more about his expertise or services?"
  },
  
  "services": {
    response: "Muatasim Billah offers the following services:\n\n• 🛍️ Shopify Store Design (Complete e-commerce solutions)\n• 💻 Frontend Website Development (Interactive, animated sites)\n• 🤖 AI Talking Avatars/Spokespersons (Realistic digital presenters)\n• 🎨 Canva Design (Professional graphics & templates)\n• 🔊 AI Voice Overs (Natural-sounding narrations)\n• 🎚️ Audio Engineering (Professional sound editing & mixing)",
    followUp: "Would you like details about any specific service?"
  },
  
  "shopify": {
    response: "🛒 **Shopify Store Design Services** 🛒\n\n• Complete store setup & configuration\n• Premium theme customization (Dawn, Debut, etc.)\n• Mobile-responsive design optimization\n• Product page & collection templates\n• Checkout customization & conversion optimization\n• SEO setup & marketing integration\n• Payment gateway & shipping setup\n\n💰 Starting at $300 | ⏱️ 3-7 day turnaround",
    followUp: "Would you like to discuss your specific Shopify needs?"
  },
  
  "website": {
    response: "🌐 **Frontend Website Development** 🌐\n\n• Custom, responsive website design\n• Interactive UI/UX with animations\n• GSAP & ScrollTrigger animations\n• Performance-optimized code\n• Cross-browser compatibility\n• SEO-friendly structure\n• Contact forms & basic functionality\n\n💰 Starting at $250 | ⏱️ 4-10 day turnaround",
    followUp: "Should Muatasim create something similar for your business?"
  },
  
  "avatars": {
    response: "🤖 **AI Talking Avatars** 🤖\n\n• Realistic digital spokespersons\n• Perfect lip-sync with neural voices\n• Custom avatar creation\n• Multiple language support\n• Natural gestures & expressions\n• Easy video integration\n• Script-to-video automation\n\n💰 Starting at $150 | ⏱️ 1-3 day delivery",
    followUp: "Would you like to see some avatar samples?"
  },
  
  "canva": {
    response: "🎨 **Canva Design Services** 🎨\n\n• Social media templates (Instagram, Facebook, LinkedIn)\n• Business branding (logos, business cards)\n• Presentation designs\n• Marketing materials (flyers, brochures)\n• Animated social media posts\n• Brand kit development\n• Custom templates for your team\n\n💰 Starting at $50 | ⏱️ 24-48 hour delivery",
    followUp: "What type of Canva design do you need?"
  },
  
  "voice": {
    response: "🔊 **AI Voice Over Services** 🔊\n\n• Natural-sounding AI voices\n• Multiple languages & accents\n• Commercial voiceovers\n• YouTube video narration\n• E-learning content\n• Character voices\n• Audio advertisements\n\n💰 Starting at $20 | ⏱️ 24-hour delivery",
    followUp: "What type of voiceover project do you have?"
  },
  
  "audio": {
    response: "🎧 **Audio Engineering Services** 🎧\n\n• Professional voiceover editing\n• Podcast mixing & mastering\n• Noise reduction & cleanup\n• Audio restoration\n• Volume leveling\n• Adobe Podcast AI enhancement\n• Music balancing\n\n💰 Starting at $30 | ⏱️ 24-48 hour turnaround",
    followUp: "What audio files need professional editing?"
  },
  
  "cost": {
    response: "💰 **Pricing Information** 💰\n\nPricing depends on project complexity:\n\n• Basic Shopify store: $300-$500\n• Advanced Shopify store: $500-$1500\n• Basic website: $250-$500\n• Advanced website: $500-$2000\n• AI Avatar videos: $150-$500\n• Canva designs: $50-$200\n• Voiceovers: $20-$100\n• Audio editing: $30-$150\n\nMuatasim offers discounts for bundle services and ongoing projects!",
    followUp: "Would you like a custom quote for your project?"
  },
  
  "time": {
    response: "⏱️ **Project Timelines** ⏱️\n\nStandard completion times:\n\n• Shopify stores: 3-7 business days\n• Websites: 4-10 business days\n• AI avatars: 1-3 business days\n• Canva designs: 24-48 hours\n• Voiceovers: 24 hours\n• Audio editing: 24-48 hours\n\nRush delivery available for 25% additional fee",
    followUp: "Do you have a specific deadline?"
  },
  
  "languages": {
    response: "🌍 **Language Support** 🌍\n\nMuatasim's AI services support multiple languages:\n\n• English (US/UK/AU)\n• Spanish\n• French\n• German\n• Arabic\n• Hindi\n• And many more!\n\nAvatars and voiceovers maintain natural pronunciation in all supported languages.",
    followUp: "Which language do you need for your project?"
  },
  
  "contact": {
    response: "📞 **Contact Information** 📞\n\nYou can reach Muatasim Billah through:\n\n• Email: meharmahalcoll@gmail.com\n• WhatsApp: +92 3088754565\n• LinkedIn: linkedin.com/in/muatasim billah\n\nHe typically responds within 2-4 hours during business days.",
    followUp: false
  },
  
  "portfolio": {
    response: "🎨 **Portfolio** 🎨\n\nYou can view Muatasim's work samples at:\n\n• Website: muatasim.com/portfolio\n• Dribbble: dribbble.com/muatasim\n• Behance: behance.net/muatasim\n\nFor specific examples related to your industry, please let me know what you're looking for!",
    followUp: "Would you like to see samples of a specific service?"
  },
  
  "blogs": {
    response: "📝 **Blog Posts** 📝\n\nMuatasim writes detailed articles about:\n\n• Web Development and UI/UX Design\n• AI Voice Technology\n• Graphic Design with Canva\n• E-commerce Strategies\n• AI Talking Avatars\n• Audio Engineering\n\nYou can check all articles at muatasim.com/blog. Any specific topic you're interested in?",
    followUp: "Would you like me to recommend an article based on your interests?"
  },
  
  "blog_web_development": {
    response: "🌐 **Web Development Blog** 🌐\n\nMuatasim's latest article 'Why UI/UX Matters in Modern Website Design' covers:\n\n• The impact of good design on business metrics\n• Key principles of effective UI/UX\n• How design affects conversion rates\n• Accessibility considerations\n• Balancing aesthetics and functionality\n\nCheck it out at muatasim.com/blog/web-development.html",
    followUp: "Did you know that well-designed interfaces can increase conversion rates by up to 200%?"
  },
  
  "blog_ai_voice": {
    response: "🔊 **AI Voice Technology Blog** 🔊\n\nThe article on AI Voice Technology explores:\n\n• The evolution of text-to-speech technology\n• How neural networks create natural-sounding voices\n• Commercial applications for businesses\n• Ethical considerations in AI voice\n• Future trends in voice technology\n\nRead more at muatasim.com/blog/ai-voice.html",
    followUp: "Would you like to know more about how AI voices are being used in marketing?"
  },
  
  "blog_graphic_design": {
    response: "🎨 **Graphic Design with Canva Blog** 🎨\n\nMuatasim's Canva design guide covers:\n\n• Professional design principles anyone can apply\n• Color psychology in marketing materials\n• Typography best practices\n• Creating consistent brand identity\n• Time-saving Canva Pro features\n\nRead the full article at muatasim.com/blog/graphic-design.html",
    followUp: "Did you know that consistent brand presentation can increase revenue by up to 23%?"
  },
  
  "blog_ecommerce": {
    response: "🛍️ **E-commerce Blog** 🛍️\n\nThe e-commerce redesign article covers:\n\n• Conversion optimization strategies\n• Mobile commerce best practices\n• Checkout flow optimization\n• Product page psychology\n• Performance improvements for Shopify stores\n\nLearn more at muatasim.com/blog/ecommerce-redesign.html",
    followUp: "Did you know that 69.57% of online shopping carts are abandoned? Muatasim shares strategies to reduce this in his article."
  },
  
  "blog_ai_avatars": {
    response: "🤖 **AI Talking Avatars Blog** 🤖\n\nThe article on AI avatars for business explores:\n\n• How digital humans are changing customer service\n• Creating personalized customer experiences\n• Reducing video production costs\n• Implementation strategies for different industries\n• Future of AI spokespersons\n\nRead more at muatasim.com/blog/ai-avatar.html",
    followUp: "Would you like to know how businesses are increasing engagement by 3-5x with AI avatars?"
  },
  
  "blog_audio_engineering": {
    response: "🎧 **Audio Engineering Blog** 🎧\n\nMuatasim's audio engineering guide covers:\n\n• Professional microphone techniques\n• EQ and compression fundamentals\n• Vocal chain processing\n• Noise reduction methods\n• Common audio problems and solutions\n\nGet the full tutorial at muatasim.com/blog/audio-engineering.html",
    followUp: "Are you working on any audio projects that could benefit from these techniques?"
  },
  
  "thanks": {
    response: "You're welcome! I'm glad I could help. Is there anything else you'd like to know about Muatasim's services?",
    followUp: false
  },
  
  "goodbye": {
    response: "Thank you for chatting! If you need more information later, feel free to return. Have a great day!",
    followUp: false
  },
  
  "fallback": {
    response: "I understand you're asking about something related to Muatasim Billah's portfolio. Could you please clarify what specific information you're looking for? I can tell you about his services, projects, blog articles, or how to contact him.",
    followUp: "Or, would you like to know about a specific service like web development, AI avatars, or e-commerce?"
  }
};

// Enhanced keyword mapping for smarter responses with priority
const keywordMap = [
  // General conversation starters
  { keywords: ["hello", "hi", "hey", "greetings", "hi there", "good morning", "good afternoon", "good evening"], topic: "introduction", priority: 10 },
  { keywords: ["how are you", "how do you feel", "are you good", "feeling", "mood", "emotion"], topic: "feelings", priority: 9 },
  { keywords: ["who made you", "who created you", "who built you", "who designed you", "your creator", "your designer", "your developer"], topic: "creator", priority: 9 },
  { keywords: ["who is your boss", "who is your ceo", "who is your owner", "who do you work for", "who runs", "who owns"], topic: "ceo", priority: 9 },
  { keywords: ["thank", "thanks", "thank you", "appreciate", "grateful"], topic: "thanks", priority: 9 },
  { keywords: ["bye", "goodbye", "see you", "later", "take care", "farewell"], topic: "goodbye", priority: 9 },

  // Service inquiries
  { keywords: ["service", "services", "offer", "provide", "what can you do", "what do you do", "help with"], topic: "services", priority: 8 },
  
  // Shopify related
  { keywords: ["shopify", "ecommerce", "e-commerce", "store", "online shop", "online store", "web shop", "selling online"], topic: "shopify", priority: 8 },
  
  // Website development related
  { keywords: ["website", "web development", "web design", "frontend", "front-end", "site", "webpage", "landing page", "web page"], topic: "website", priority: 8 },
  
  // AI Avatars related
  { keywords: ["avatar", "talking avatar", "ai avatar", "digital human", "spokesperson", "virtual human", "virtual presenter", "digital presenter"], topic: "avatars", priority: 8 },
  
  // Canva design related
  { keywords: ["canva", "design", "graphic design", "graphics", "templates", "social media design", "branding", "visuals", "poster"], topic: "canva", priority: 8 },
  
  // Voice over related
  { keywords: ["voice", "voiceover", "voice over", "narration", "narrator", "ai voice", "text to speech", "tts", "audio narration"], topic: "voice", priority: 8 },
  
  // Audio engineering related
  { keywords: ["audio", "audio engineering", "sound", "sound editing", "mixing", "mastering", "podcast", "recording", "audio quality"], topic: "audio", priority: 8 },
  
  // Pricing inquiries
  { keywords: ["price", "pricing", "cost", "how much", "fee", "rate", "charges", "affordable", "budget", "expensive", "cheap", "payment"], topic: "cost", priority: 7 },
  
  // Timeline inquiries
  { keywords: ["time", "timeline", "deadline", "how long", "duration", "turnaround", "delivery", "when", "schedule", "fast", "quick", "urgent"], topic: "time", priority: 7 },
  
  // Language support
  { keywords: ["language", "languages", "translate", "translation", "multilingual", "accent", "international", "global", "english", "spanish", "hindi", "arabic"], topic: "languages", priority: 6 },
  
  // Contact information
  { keywords: ["contact", "email", "phone", "message", "reach out", "call", "text", "whatsapp", "communicate", "get in touch"], topic: "contact", priority: 7 },
  
  // Portfolio and examples
  { keywords: ["portfolio", "examples", "samples", "work", "projects", "showcase", "previous work", "case studies", "demo", "demonstration"], topic: "portfolio", priority: 7 },
  
  // Blog content
  { keywords: ["blog", "article", "post", "read", "guide", "tutorial", "learn", "knowledge", "information", "resources"], topic: "blogs", priority: 6 },
  { keywords: ["web development blog", "website blog", "web design article", "ui/ux", "frontend blog"], topic: "blog_web_development", priority: 6 },
  { keywords: ["ai voice blog", "voice technology", "text to speech article", "tts blog"], topic: "blog_ai_voice", priority: 6 },
  { keywords: ["graphic design blog", "canva blog", "design article", "canva tutorial"], topic: "blog_graphic_design", priority: 6 },
  { keywords: ["ecommerce blog", "shopify blog", "online store article", "e-commerce guide"], topic: "blog_ecommerce", priority: 6 },
  { keywords: ["ai avatar blog", "talking avatar article", "digital human blog", "virtual spokesperson guide"], topic: "blog_ai_avatars", priority: 6 },
  { keywords: ["audio engineering blog", "sound editing article", "audio blog", "podcast editing guide"], topic: "blog_audio_engineering", priority: 6 }
];

// ----------------------
// CORE CHATBOT FUNCTIONS
// ----------------------

// Main initialization function - runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const chatIcon = document.getElementById('chat-icon');
    const chatContainer = document.getElementById('chat-container');
    const minimizeChat = document.getElementById('minimize-chat');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const voiceInput = document.getElementById('voice-input');
    const voiceStatus = document.getElementById('voice-status');
    const inputStatus = document.getElementById('input-status');
    
    // Conversation state
    let conversationHistory = [];
    let isListening = false;
    
    // ----------------------
    // Speech Recognition API
    // ----------------------
    let recognition = null;
    
    // Initialize speech recognition
    function initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            
            if (recognition) {
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-US';
                
                setupRecognitionEventListeners();
                return true;
            }
        }
        
        console.warn('Speech recognition not supported in this browser');
        return false;
    }
    
    function setupRecognitionEventListeners() {
        if (!recognition) return;
        
        recognition.onstart = function() {
            isListening = true;
            voiceInput.classList.add('active');
            voiceStatus.classList.remove('hidden');
            inputStatus.classList.remove('hidden');
            userInput.placeholder = 'Listening...';
        };
        
        recognition.onresult = function(event) {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                    userInput.value = finalTranscript;
                    
                    // Auto-submit when we get a final result
                    setTimeout(() => {
                        handleSubmit();
                    }, 500);
                } else {
                    interimTranscript += transcript;
                    userInput.value = interimTranscript;
                }
            }
            
            updateSendButtonState();
        };
        
        recognition.onerror = function(event) {
            let errorMessage = 'Recognition error';
            
            if (event.error === 'no-speech') {
                errorMessage = 'No speech detected. Try again.';
            } else if (event.error === 'audio-capture') {
                errorMessage = 'No microphone detected.';
            } else if (event.error === 'not-allowed') {
                errorMessage = 'Microphone permission denied.';
            } else if (event.error === 'network') {
                errorMessage = 'Network error occurred.';
            } else if (event.error === 'aborted') {
                errorMessage = 'Recognition aborted.';
            } else {
                errorMessage = `Error: ${event.error}`;
            }
            
            console.error('Speech recognition error:', errorMessage);
            stopListening();
        };
        
        recognition.onend = function() {
            stopListening();
        };
    }
    
    function startListening() {
        if (!recognition) {
            if (!initSpeechRecognition()) {
                alert('Speech recognition is not supported in your browser.');
                return;
            }
        }
        
        try {
            recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
        }
    }
    
    function stopListening() {
        isListening = false;
        voiceInput.classList.remove('active');
        voiceStatus.classList.add('hidden');
        inputStatus.classList.add('hidden');
        userInput.placeholder = 'Type your message...';
        
        if (recognition) {
            try {
                recognition.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
    }
    
    // Toggle voice input
    function toggleVoiceInput() {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }
    
    // -----------------------
    // NLP and Response System
    // -----------------------
    
    // Types for interface
    class ChatMessage {
        constructor(role, message, timestamp = Date.now()) {
            this.role = role; // 'user' or 'assistant'
            this.message = message;
            this.timestamp = timestamp;
            this.isTyping = false;
            this.suggestedQuestions = [];
        }
    }
    
    /**
     * Calculate score for keyword matching
     */
    function calculateMatchScore(keywords, input, recentContext = []) {
        let score = 0;
        let matchedKeywords = [];
        const normalizedInput = input.toLowerCase().trim();
        
        // Check for exact matches (highest priority)
        keywords.forEach(keyword => {
            if (normalizedInput.includes(keyword.toLowerCase())) {
                // Give more weight to longer keyword matches
                const matchScore = 10 * (1 + (keyword.length / 20));
                score += matchScore;
                matchedKeywords.push(keyword);
            }
        });
        
        // Check for partial matches (fuzzy matching)
        if (matchedKeywords.length === 0) {
            keywords.forEach(keyword => {
                if (keyword.length > 3) { // Only check meaningful words
                    const keywordParts = keyword.split(' ');
                    keywordParts.forEach(part => {
                        if (part.length > 3 && normalizedInput.includes(part.toLowerCase())) {
                            const partialMatchScore = 5 * (1 + (part.length / 15));
                            score += partialMatchScore;
                            matchedKeywords.push(part);
                        }
                    });
                }
            });
        }
        
        // Check for word proximity (words appearing close together)
        if (matchedKeywords.length > 1) {
            // Add bonus for multiple keyword matches
            score += matchedKeywords.length * 2;
        }
        
        // Boost score based on conversation context
        if (recentContext && recentContext.length > 0 && matchedKeywords.length > 0) {
            const contextRelevance = recentContext.filter(ctx => 
                matchedKeywords.some(keyword => ctx.includes(keyword.toLowerCase()))
            ).length;
            
            // Context from recent messages increases relevance
            score += contextRelevance * 3;
        }
        
        return {
            topic: keywords.join(','),
            score,
            matchedKeywords
        };
    }
    
    /**
     * Analyze user input to determine the most likely topic
     */
    function analyzeUserInput(userInput, conversationHistory) {
        const normalizedInput = userInput.toLowerCase().trim();
        
        // Get recent conversation context (last 3 messages)
        const recentMessages = conversationHistory
            .slice(-3)
            .map(item => item.message.toLowerCase());
        
        // Score each topic based on keyword matches
        const topicScores = [];
        
        keywordMap.forEach(mapping => {
            const match = calculateMatchScore(
                mapping.keywords, 
                normalizedInput, 
                recentMessages
            );
            
            topicScores.push({
                topic: mapping.topic,
                score: match.score * (mapping.priority / 5), // Apply priority multiplier
                matchedKeywords: match.matchedKeywords
            });
        });
        
        // Sort by score (descending)
        topicScores.sort((a, b) => b.score - a.score);
        
        let bestMatch = {
            topic: 'fallback',
            score: 0,
            matchedKeywords: []
        };
        
        if (topicScores.length > 0 && topicScores[0].score > 5) {
            bestMatch = {
                topic: topicScores[0].topic,
                score: topicScores[0].score,
                matchedKeywords: topicScores[0].matchedKeywords
            };
        }
        
        return bestMatch;
    }
    
    /**
     * Generate suggested follow-up questions based on the current topic
     */
    function generateSuggestedQuestions(topic, userInput) {
        const suggestions = {
            'introduction': ['What services do you offer?', 'Tell me about your experience', 'Who are you?'],
            'services': ['Tell me about Shopify stores', 'What about AI avatars?', 'Website development details'],
            'shopify': ['Shopify pricing', 'How long for a Shopify store?', 'Shopify store examples'],
            'website': ['Website pricing', 'Website examples', 'What technologies do you use?'],
            'avatars': ['Avatar samples', 'How much for an avatar?', 'How do avatars work?'],
            'canva': ['Canva design examples', 'Pricing for Canva work', 'Canva templates'],
            'voice': ['Voice samples', 'Language options', 'Voice over pricing'],
            'audio': ['Audio editing services', 'Audio samples', 'Podcast editing?'],
            'cost': ['Bulk discounts?', 'Payment methods', 'Refund policy'],
            'time': ['Rush delivery options?', 'Availability', 'Project start date?'],
            'contact': ['Best time to reach?', 'Schedule a consultation', 'Portfolio examples'],
            'portfolio': ['Recent projects', 'Case studies', 'Client testimonials'],
            'fallback': ['Services offered', 'Contact information', 'Portfolio examples']
        };
        
        // Return default suggestions if no specific topic matches
        return suggestions[topic] || suggestions['fallback'];
    }
    
    /**
     * Retrieve response from knowledge base based on topic
     */
    function getResponseFromKnowledgeBase(topicMatch) {
        // Get response content from knowledge base
        const topic = knowledgeBase[topicMatch.topic] || knowledgeBase.fallback;
        let response = topic.response;
        
        // Add follow-up if available
        if (topic.followUp) {
            response += "\n\n" + topic.followUp;
        }
        
        // Generate contextual suggestions
        const suggestedQuestions = generateSuggestedQuestions(topicMatch.topic, topicMatch.matchedKeywords.join(' '));
        
        return { response, suggestedQuestions };
    }
    
    /**
     * Process user messages and generate AI responses
     */
    function processUserMessage(userMessage, conversationHistory) {
        // Analyze user input for intent
        const topicMatch = analyzeUserInput(userMessage, conversationHistory);
        
        // Get response based on the detected topic
        return getResponseFromKnowledgeBase(topicMatch);
    }
    
    /**
     * Format message with markdown-like syntax for display
     */
    function formatMessage(message) {
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n• (.*)/g, '</p><ul class="list-disc list-inside"><li>$1</li>')
            .replace(/\n- (.*)/g, '</p><ul class="list-disc list-inside"><li>$1</li>')
            .replace(/<\/li>\n• (.*)/g, '</li><li>$1')
            .replace(/<\/li>\n- (.*)/g, '</li><li>$1')
            .replace(/<\/li>(?!\n<)/g, '</li></ul><p>')
            .replace(/💰/g, '<span class="emoji-green">💰</span>')
            .replace(/⏱️/g, '<span class="emoji-amber">⏱️</span>')
            .replace(/🛒|🛍️/g, '<span class="emoji-blue">$&</span>')
            .replace(/🤖/g, '<span class="emoji-purple">🤖</span>')
            .replace(/🎨/g, '<span class="emoji-pink">🎨</span>')
            .replace(/🔊/g, '<span class="emoji-indigo">🔊</span>')
            .replace(/🎧/g, '<span class="emoji-cyan">🎧</span>')
            .replace(/🌐/g, '<span class="emoji-blue">🌐</span>');
    }
    
    // -------------------------
    // UI and Rendering Functions
    // -------------------------
    
    // Initialize chat with welcome message
    function initChat() {
        // Try to load conversation from localStorage
        loadConversation();
        
        if (conversationHistory.length === 0) {
            // Add welcome message if no history exists
            const welcomeMessage = new ChatMessage(
                'assistant',
                "Hello! I'm the AI assistant for Muatasim Billah's portfolio. How can I assist you today?"
            );
            
            welcomeMessage.suggestedQuestions = [
                'What services do you offer?', 
                'Tell me about AI avatars', 
                'Shopify pricing'
            ];
            
            conversationHistory.push(welcomeMessage);
            renderMessages();
        }
        
        // Initialize speech recognition
        initSpeechRecognition();
        
        // Initialize OpenAI if available
        if (typeof initOpenAI === 'function') {
            initOpenAI();
        }
    }
    
    // Add a message to the chat
    function addMessage(role, message, isTyping = false, suggestedQuestions = []) {
        const chatMessage = new ChatMessage(role, message);
        chatMessage.isTyping = isTyping;
        chatMessage.suggestedQuestions = suggestedQuestions;
        
        conversationHistory.push(chatMessage);
        renderMessages();
        saveConversation();
    }
    
    // Render messages in the chat UI
    function renderMessages() {
        chatMessages.innerHTML = '';
        
        conversationHistory.forEach((item, index) => {
            if (item.role === 'user') {
                // User message
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message message-user animate-slide-up';
                messageDiv.innerHTML = `
                    <div class="message-bubble">
                        <p>${item.message}</p>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
            } else if (item.isTyping) {
                // Typing indicator
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message message-assistant animate-slide-up';
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="ri-robot-line"></i>
                    </div>
                    <div class="message-bubble">
                        <div class="typing-indicators">
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                            <span class="typing-dot"></span>
                        </div>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
            } else {
                // Bot message
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message message-assistant animate-fade-in';
                
                // Format message with rich content
                const formattedMessage = formatMessage(item.message);
                
                messageDiv.innerHTML = `
                    <div class="message-avatar">
                        <i class="ri-robot-line"></i>
                    </div>
                    <div class="message-bubble">
                        <p>${formattedMessage}</p>
                    </div>
                `;
                chatMessages.appendChild(messageDiv);
                
                // Add suggested questions if available (for the last message only)
                if (index === conversationHistory.length - 1 && 
                    item.suggestedQuestions && 
                    item.suggestedQuestions.length > 0) {
                    
                    const suggestionsDiv = document.createElement('div');
                    suggestionsDiv.className = 'suggested-questions animate-slide-up';
                    
                    item.suggestedQuestions.forEach(question => {
                        const button = document.createElement('button');
                        button.className = 'question-btn';
                        button.textContent = question;
                        button.addEventListener('click', () => {
                            handleQuestionButtonClick(question);
                        });
                        
                        suggestionsDiv.appendChild(button);
                    });
                    
                    chatMessages.appendChild(suggestionsDiv);
                }
            }
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle sending a message
    async function handleSubmit() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage('user', message);
        
        // Clear input
        userInput.value = '';
        updateSendButtonState();
        
        // Add typing indicator
        const typingMessage = new ChatMessage('assistant', '');
        typingMessage.isTyping = true;
        conversationHistory.push(typingMessage);
        renderMessages();
        
        // Check if we should use OpenAI (if available)
        let response;
        if (typeof enhancedProcessUserMessage === 'function' && window.useOpenAI && window.openaiKey) {
            try {
                response = await enhancedProcessUserMessage(message, conversationHistory);
            } catch (error) {
                console.error('Error processing with OpenAI, falling back to local:', error);
                response = processUserMessage(message, conversationHistory);
            }
        } else {
            // Use local processing
            response = processUserMessage(message, conversationHistory);
        }
        
        // Calculate typing delay based on message length
        const typingDelay = calculateTypingDelay(response.response);
        
        // After a delay, replace the typing indicator with the actual response
        setTimeout(() => {
            // Remove the typing indicator
            conversationHistory.pop();
            
            // Add the actual response
            addMessage('assistant', response.response, false, response.suggestedQuestions);
        }, typingDelay);
    }
    
    // Handle question button clicks
    function handleQuestionButtonClick(question) {
        userInput.value = question;
        updateSendButtonState();
        setTimeout(() => {
            handleSubmit();
        }, 100);
    }
    
    // Calculate typing delay based on message length
    function calculateTypingDelay(message) {
        const baseDelay = 800;
        const charDelay = Math.min(50, Math.max(20, 5000 / message.length));
        return Math.min(4000, baseDelay + message.length * charDelay);
    }
    
    // Update send button state based on input
    function updateSendButtonState() {
        sendButton.disabled = userInput.value.trim().length === 0;
    }
    
    // Save conversation history to localStorage
    function saveConversation() {
        try {
            // Keep only the most recent 50 messages to avoid exceeding storage limits
            const trimmedHistory = conversationHistory.slice(-50);
            localStorage.setItem('portfolioChatHistory', JSON.stringify(trimmedHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }
    
    // Load conversation history from localStorage
    function loadConversation() {
        try {
            const savedHistory = localStorage.getItem('portfolioChatHistory');
            if (savedHistory) {
                conversationHistory = JSON.parse(savedHistory);
                // Only load the last 10 messages on initial load to prevent bloat
                conversationHistory = conversationHistory.slice(-10);
                renderMessages();
                return true;
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            localStorage.removeItem('portfolioChatHistory');
        }
        
        return false;
    }
    
    // Toggle chat visibility
    function toggleChat() {
        chatContainer.classList.toggle('hidden');
        if (!chatContainer.classList.contains('hidden')) {
            userInput.focus();
        }
    }
    
    // ------------------
    // Event Listeners
    // ------------------
    
    // Toggle chat visibility
    chatIcon.addEventListener('click', toggleChat);
    minimizeChat.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', toggleChat);
    
    // Send message events
    sendButton.addEventListener('click', handleSubmit);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    });
    
    // Voice input toggle
    voiceInput.addEventListener('click', toggleVoiceInput);
    
    // Update send button state on input
    userInput.addEventListener('input', updateSendButtonState);
    
    // Initialize the chat
    initChat();
    
    // Make key functions available globally for OpenAI integration
    window.ChatMessage = ChatMessage;
    window.processUserMessage = processUserMessage;
    window.addMessage = addMessage;
    window.handleSubmit = handleSubmit;
    window.updateSendButtonState = updateSendButtonState;
    window.calculateTypingDelay = calculateTypingDelay;
    window.conversationHistory = conversationHistory;
    window.analyzeUserInput = analyzeUserInput;
    window.generateSuggestedQuestions = generateSuggestedQuestions;
});

// ----------------------
// OPENAI INTEGRATION
// ----------------------

// Global variables
let useOpenAI = false;
let openaiKey = '';
let openAIModel = 'gpt-3.5-turbo'; // Default model

// Initialize OpenAI settings
function initOpenAI() {
    // Try to get OpenAI key from localStorage
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
        openaiKey = savedKey;
        useOpenAI = true;
        console.log('OpenAI integration enabled');
        
        // Update UI to show OpenAI is active
        const aiStatusIndicator = document.getElementById('ai-status-indicator');
        if (aiStatusIndicator) {
            aiStatusIndicator.classList.remove('hidden');
            aiStatusIndicator.innerHTML = `<span class="ai-badge">GPT Active</span>`;
        }
    }
    
    // Add OpenAI configuration UI
    addOpenAIConfigUI();
}

// Set OpenAI API key
function setOpenAIKey(key) {
    if (key && key.startsWith('sk-') && key.length > 20) {
        openaiKey = key;
        localStorage.setItem('openai_api_key', key);
        useOpenAI = true;
        
        // Update UI to show OpenAI is active
        const aiStatusIndicator = document.getElementById('ai-status-indicator');
        if (aiStatusIndicator) {
            aiStatusIndicator.classList.remove('hidden');
            aiStatusIndicator.innerHTML = `<span class="ai-badge">GPT Active</span>`;
        }
        
        return true;
    } else {
        console.error('Invalid OpenAI API key format');
        return false;
    }
}

// Set OpenAI model
function setOpenAIModel(model) {
    const allowedModels = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'];
    if (allowedModels.includes(model)) {
        openAIModel = model;
        localStorage.setItem('openai_model', model);
        return true;
    } else {
        console.error('Invalid OpenAI model');
        return false;
    }
}

// Add OpenAI configuration UI
function addOpenAIConfigUI() {
    // Add OpenAI configuration icon to chat header
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        const configButton = document.createElement('button');
        configButton.id = 'openai-config';
        configButton.className = 'header-button';
        configButton.setAttribute('aria-label', 'Configure OpenAI');
        configButton.innerHTML = '<i class="ri-settings-3-line"></i>';
        
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'ai-status-indicator';
        statusIndicator.className = 'hidden';
        
        headerActions.insertBefore(configButton, headerActions.firstChild);
        configButton.appendChild(statusIndicator);
        
        // Initialize OpenAI indicator
        if (useOpenAI) {
            statusIndicator.classList.remove('hidden');
            statusIndicator.innerHTML = `<span class="ai-badge">GPT Active</span>`;
        }
        
        // Add event listener for config button
        configButton.addEventListener('click', showOpenAIConfig);
    }
    
    // Add CSS for OpenAI configuration
    const style = document.createElement('style');
    style.textContent = `
        #ai-status-indicator {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #10b981;
            color: white;
            border-radius: 9999px;
            padding: 2px 8px;
            font-size: 0.7rem;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        #openai-config {
            position: absolute;
            top: 12px;
            right: 50px;
            color: rgba(255,255,255,0.7);
            cursor: pointer;
            transition: color 0.2s;
        }
        
        #openai-config:hover {
            color: white;
        }
        
        .openai-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .openai-modal-content {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .openai-modal h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: var(--primary-700);
        }
        
        .input-group {
            margin-bottom: 15px;
        }
        
        .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: var(--neutral-700);
        }
        
        .input-group input, .input-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--neutral-300);
            border-radius: 4px;
            font-size: 14px;
        }
        
        .modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        
        .primary-button {
            background-color: var(--primary-600);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .primary-button:hover {
            background-color: var(--primary-700);
        }
        
        .secondary-button {
            background-color: white;
            color: var(--neutral-700);
            border: 1px solid var(--neutral-300);
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .secondary-button:hover {
            background-color: var(--neutral-100);
        }
    `;
    document.head.appendChild(style);
}

// Show OpenAI configuration modal
function showOpenAIConfig() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'openai-modal';
    modal.innerHTML = `
        <div class="openai-modal-content">
            <h3>Configure OpenAI Integration</h3>
            <p>Enter your OpenAI API key to enable GPT responses. Your API key is stored locally in your browser.</p>
            <div class="input-group">
                <label for="openai-key">OpenAI API Key</label>
                <input type="password" id="openai-key" placeholder="sk-..." value="${openaiKey}">
            </div>
            <div class="input-group">
                <label for="openai-model">Model</label>
                <select id="openai-model">
                    <option value="gpt-3.5-turbo" ${openAIModel === 'gpt-3.5-turbo' ? 'selected' : ''}>GPT-3.5 Turbo</option>
                    <option value="gpt-4" ${openAIModel === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
                    <option value="gpt-4-turbo" ${openAIModel === 'gpt-4-turbo' ? 'selected' : ''}>GPT-4 Turbo</option>
                </select>
            </div>
            <div class="modal-buttons">
                <button id="save-openai-config" class="primary-button">Save</button>
                <button id="cancel-openai-config" class="secondary-button">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('save-openai-config').addEventListener('click', function() {
        const key = document.getElementById('openai-key').value;
        const model = document.getElementById('openai-model').value;
        
        if (setOpenAIKey(key)) {
            setOpenAIModel(model);
            document.body.removeChild(modal);
        } else {
            alert('Invalid API key format. It should start with "sk-" and be at least 20 characters long.');
        }
    });
    
    document.getElementById('cancel-openai-config').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

// Generate system prompt based on knowledge base
function generateSystemPrompt() {
    // Extract key information from knowledge base to instruct the model
    let serviceInfo = '';
    
    if (knowledgeBase.services && knowledgeBase.services.response) {
        serviceInfo = knowledgeBase.services.response;
    }
    
    const systemPrompt = `You are an AI assistant for Muatasim Billah's portfolio website. 
Be friendly, professional and helpful. Your role is to provide information about Muatasim's services and help potential clients.

Here's key information about Muatasim and his services:
${serviceInfo}

If asked about pricing or timelines, be specific with the rates and timeframes mentioned in the knowledge base.
Never make up information. If you don't know something specific, suggest contacting Muatasim directly.
Keep responses concise but comprehensive, using bullet points for clarity when listing features or services.
Always maintain a professional tone. Use emojis occasionally for a friendly touch.

Current date: ${new Date().toLocaleDateString()}`;

    return systemPrompt;
}

// Format conversation history for OpenAI API
function formatConversationForOpenAI(conversationHistory) {
    const messages = [];
    
    // Add system message
    messages.push({
        role: 'system',
        content: generateSystemPrompt()
    });
    
    // Add conversation history (limit to last 10 messages for token efficiency)
    const recentMessages = conversationHistory.slice(-10);
    
    recentMessages.forEach(msg => {
        if (!msg.isTyping) {
            messages.push({
                role: msg.role,
                content: msg.message
            });
        }
    });
    
    return messages;
}

// Process user message with OpenAI API
async function processWithOpenAI(userMessage, conversationHistory) {
    if (!useOpenAI || !openaiKey) {
        console.log('OpenAI not configured, falling back to local processing');
        return null;
    }
    
    try {
        const messages = formatConversationForOpenAI(conversationHistory);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                model: openAIModel,
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content.trim();
        
        // Generate suggested questions based on the context
        const suggestedQuestions = generateDynamicSuggestions(
            userMessage, 
            aiResponse, 
            conversationHistory
        );
        
        return { 
            response: aiResponse, 
            suggestedQuestions 
        };
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        // Fall back to local processing
        return null;
    }
}

// Generate dynamic suggested questions based on conversation context
function generateDynamicSuggestions(userMessage, aiResponse, conversationHistory) {
    // Default questions based on the most relevant topics
    const defaultSuggestions = {
        services: ['What services do you offer?', 'Tell me about pricing', 'Portfolio examples'],
        pricing: ['Do you offer discounts?', 'Payment methods', 'Service timelines'],
        portfolio: ['Recent projects', 'Client testimonials', 'Specific service examples'],
        contact: ['How to get in touch', 'Response time', 'Project consultation']
    };
    
    // Try to identify the current conversation topic
    const topicMatch = analyzeUserInput(userMessage + ' ' + aiResponse, conversationHistory);
    
    if (topicMatch && topicMatch.topic && topicMatch.topic !== 'fallback') {
        // Get questions from the static suggestions in the chatbot.js
        return generateSuggestedQuestions(topicMatch.topic, userMessage);
    } else {
        // If no clear topic, select random default questions
        const allQuestions = [].concat(...Object.values(defaultSuggestions));
        const randomQuestions = [];
        
        // Select 3 random questions
        while (randomQuestions.length < 3 && allQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            randomQuestions.push(allQuestions[randomIndex]);
            allQuestions.splice(randomIndex, 1);
        }
        
        return randomQuestions;
    }
}

// Extended processing function that uses OpenAI if available
async function enhancedProcessUserMessage(userMessage, conversationHistory) {
    // If OpenAI is configured, try to use it first
    if (useOpenAI && openaiKey) {
        try {
            const openAIResponse = await processWithOpenAI(userMessage, conversationHistory);
            if (openAIResponse) {
                return openAIResponse;
            }
        } catch (error) {
            console.error('Error processing with OpenAI, falling back to local:', error);
        }
    }
    
    // Fall back to the original local processing
    return processUserMessage(userMessage, conversationHistory);
}

// Make OpenAI functions globally available
window.initOpenAI = initOpenAI;
window.enhancedProcessUserMessage = enhancedProcessUserMessage;
window.useOpenAI = useOpenAI;
window.openaiKey = openaiKey;
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
  