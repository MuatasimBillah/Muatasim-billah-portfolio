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
  document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const chatIcon = document.getElementById('chat-icon');
    const chatContainer = document.getElementById('chat-container');
    const minimizeChat = document.getElementById('minimize-chat');
    const closeChat = document.getElementById('close-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const questionButtons = document.querySelectorAll('.question-btn');
    
    // Conversation history
    let conversationHistory = [];
    
    // Enhanced knowledge base
    const knowledgeBase = {
      "welcome": {
        response: "Hello! I'm Muatasim Billah, an expert in Shopify Store Design, Frontend Website Development, AI Talking Avatars, Canva Design, AI Voice Overs, and Audio Engineering. How can I help you today?",
        followUp: false
      },
      
      "services": {
        response: "I offer the following services:\n\n• 🛍️ Shopify Store Design (Complete e-commerce solutions)\n• 💻 Frontend Website Development (Interactive, animated sites)\n• 🤖 AI Talking Avatars/Spokespersons (Realistic digital presenters)\n• 🎨 Canva Design (Professional graphics & templates)\n• 🔊 AI Voice Overs (Natural-sounding narrations)\n• 🎚️ Audio Engineering (Professional sound editing & mixing)",
        followUp: "Would you like details about any specific service?"
      },
      
      "shopify": {
        response: "🛒 **Shopify Store Design Services** 🛒\n\n• Complete store setup & configuration\n• Premium theme customization (Dawn, Debut, etc.)\n• Mobile-responsive design optimization\n• Product page & collection templates\n• Checkout customization & conversion optimization\n• SEO setup & marketing integration\n• Payment gateway & shipping setup\n\n💰 Starting at $300 | ⏱️ 3-7 day turnaround",
        followUp: "Would you like to discuss your specific Shopify needs?"
      },
      
      "website": {
        response: "🌐 **Frontend Website Development** 🌐\n\n• Custom, responsive website design\n• Interactive UI/UX with animations\n• GSAP & ScrollTrigger animations\n• Performance-optimized code\n• Cross-browser compatibility\n• SEO-friendly structure\n• Contact forms & basic functionality\n\n💰 Starting at $250 | ⏱️ 4-10 day turnaround",
        followUp: "Should I create something similar for your business?"
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
        response: "💰 **Pricing Information** 💰\n\nPricing depends on project complexity:\n\n• Basic Shopify store: $300-$500\n• Advanced Shopify store: $500-$1500\n• Basic website: $250-$500\n• Advanced website: $500-$2000\n• AI Avatar videos: $150-$500\n• Canva designs: $50-$200\n• Voiceovers: $20-$100\n• Audio editing: $30-$150\n\nI offer discounts for bundle services and ongoing projects!",
        followUp: "Would you like a custom quote for your project?"
      },
      
      "time": {
        response: "⏱️ **Project Timelines** ⏱️\n\nStandard completion times:\n\n• Shopify stores: 3-7 business days\n• Websites: 4-10 business days\n• AI avatars: 1-3 business days\n• Canva designs: 24-48 hours\n• Voiceovers: 24 hours\n• Audio editing: 24-48 hours\n\nRush delivery available for 25% additional fee",
        followUp: "Do you have a specific deadline?"
      },
      
      "languages": {
        response: "🌍 **Language Support** 🌍\n\nMy AI services support multiple languages:\n\n• English (US/UK/AU)\n• Spanish\n• French\n• German\n• Arabic\n• Hindi\n• And many more!\n\nAvatars and voiceovers maintain natural pronunciation in all supported languages.",
        followUp: "Which language do you need for your project?"
      },
      
      "contact": {
        response: "📞 **Contact Me** 📞\n\nYou can reach me through:\n\n• Email: contact@muatasim.com\n• WhatsApp: +1234567890\n• LinkedIn: linkedin.com/in/muatasim\n\nI typically respond within 2-4 hours during business days.",
        followUp: false
      },
      
      "portfolio": {
        response: "🎨 **My Portfolio** 🎨\n\nYou can view my work samples at:\n\n• Website: muatasim.com/portfolio\n• Dribbble: dribbble.com/muatasim\n• Behance: behance.net/muatasim\n\nFor specific examples related to your industry, please let me know what you're looking for!",
        followUp: "Would you like to see samples of a specific service?"
      },
      
      "fallback": {
        response: "🤔 I'm not sure I understood. Could you please rephrase your question? Here are some common questions I can help with:\n\n• What services do you offer?\n• How much does a Shopify store cost?\n• Can you show me your portfolio?\n• Do you work with international clients?",
        followUp: false
      }
    };
    
    // Enhanced keyword mapping with priority scores
    const keywordMap = [
      { keywords: ["hello", "hi", "hey", "greetings"], topic: "welcome", priority: 10 },
      { keywords: ["thank", "thanks", "appreciate"], topic: "thanks", priority: 9 },
      { keywords: ["bye", "goodbye", "see you"], topic: "goodbye", priority: 9 },
      { keywords: ["service", "services", "offer", "provide"], topic: "services", priority: 8 },
      { keywords: ["portfolio", "samples", "examples", "previous work"], topic: "portfolio", priority: 8 },
      { keywords: ["shopify", "ecommerce", "online store"], topic: "shopify", priority: 7 },
      { keywords: ["website", "web design", "frontend", "web development"], topic: "website", priority: 7 },
      { keywords: ["avatar", "talking head", "spokesperson", "digital human"], topic: "avatars", priority: 7 },
      { keywords: ["canva", "graphic design", "social media design"], topic: "canva", priority: 7 },
      { keywords: ["voiceover", "voice over", "narration"], topic: "voice", priority: 7 },
      { keywords: ["audio", "sound", "podcast", "editing"], topic: "audio", priority: 7 },
      { keywords: ["cost", "price", "how much"], topic: "cost", priority: 6 },
      { keywords: ["time", "how long", "duration", "delivery"], topic: "time", priority: 6 },
      { keywords: ["language", "spanish", "french", "arabic"], topic: "languages", priority: 6 },
      { keywords: ["contact", "email", "whatsapp", "reach"], topic: "contact", priority: 6 }
    ];
  
    // Improved topic detection with context awareness
    function detectTopic(userQuestion, history) {
      userQuestion = userQuestion.toLowerCase();
      let detectedTopics = [];
      
      // Check for exact matches first
      for (const item of keywordMap) {
        for (const keyword of item.keywords) {
          if (userQuestion.includes(keyword)) {
            detectedTopics.push({
              topic: item.topic,
              priority: item.priority,
              keyword: keyword
            });
            break;
          }
        }
      }
      
      // Sort by priority (highest first)
      detectedTopics.sort((a, b) => b.priority - a.priority);
      
      // Check conversation history for context
      if (history.length > 0) {
        const lastMessage = history[history.length - 1].content.toLowerCase();
        
        // If asking for more details about a service
        if (/more|detail|information|about/i.test(userQuestion)) {
          const lastTopics = detectedTopics.length > 0 ? 
            detectedTopics.map(t => t.topic) : 
            history.filter(m => m.role === 'bot').map(m => m.content);
          
          for (const service of ['shopify', 'website', 'avatars', 'canva', 'voice', 'audio']) {
            if (lastTopics.some(t => t.includes(service))) {
              return service;
            }
          }
        }
        
        // Check for follow-up questions
        if (/yes|yeah|sure|ok|please/i.test(userQuestion)) {
          const lastBotMessage = history.filter(m => m.role === 'bot').pop();
          if (lastBotMessage && lastBotMessage.followUpTopic) {
            return lastBotMessage.followUpTopic;
          }
        }
      }
      
      // Return highest priority topic or fallback
      return detectedTopics.length > 0 ? detectedTopics[0].topic : 'fallback';
    }
  
    // Enhanced response generator
    function generateResponse(userQuestion, history) {
      // Check for greetings
      if (/hello|hi|hey|greetings|howdy/i.test(userQuestion.toLowerCase())) {
        return knowledgeBase["welcome"];
      }
      
      // Check for thanks
      if (/thank|thanks|thx|appreciate/i.test(userQuestion.toLowerCase())) {
        return {
          response: "You're welcome! 😊 Is there anything else I can help you with?",
          followUp: false
        };
      }
      
      // Check for goodbyes
      if (/bye|goodbye|see you|later/i.test(userQuestion.toLowerCase())) {
        return {
          response: "Goodbye! Feel free to come back if you have more questions. Have a great day! 👋",
          followUp: false
        };
      }
      
      // Check for combined questions
      const isCostAndTime = /(how much.*how long)|(cost.*time)|(price.*duration)/i.test(userQuestion);
      if (isCostAndTime) {
        return {
          response: `${knowledgeBase["cost"].response}\n\n${knowledgeBase["time"].response}`,
          followUp: "Would you like to discuss a specific project?"
        };
      }
      
      // Detect the most relevant topic
      const topic = detectTopic(userQuestion, history);
      
      // Return the knowledge base response
      return knowledgeBase[topic];
    }
  
    // Improved message display with typing animation
    function addMessage(content, isUser = false, isFollowUp = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
      
      if (isFollowUp) {
        messageDiv.classList.add('follow-up');
      }
      
      // Convert line breaks and URLs
      const formattedContent = content
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
      
      messageDiv.innerHTML = formattedContent;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    // Enhanced typing indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'typing-indicator';
      typingDiv.id = 'typing-indicator';
      
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingDiv.appendChild(dot);
      }
      
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    function removeTypingIndicator() {
      const typing = document.getElementById('typing-indicator');
      if (typing) typing.remove();
    }
  
    // Enhanced input handling with conversation history
    function handleUserInput() {
      const userMessage = userInput.value.trim();
      if (!userMessage) return;
      
      // Add to conversation history
      conversationHistory.push({
        role: 'user',
        content: userMessage
      });
      
      // Display user message
      addMessage(userMessage, true);
      userInput.value = '';
      
      // Show typing indicator
      showTypingIndicator();
      
      // Simulate processing delay
      setTimeout(() => {
        removeTypingIndicator();
        
        // Generate bot response
        const botResponse = generateResponse(userMessage, conversationHistory);
        
        // Display main response
        addMessage(botResponse.response);
        
        // Add to conversation history
        conversationHistory.push({
          role: 'bot',
          content: botResponse.response,
          followUpTopic: botResponse.followUp ? 
            detectTopic(botResponse.followUp, conversationHistory) : null
        });
        
        // Display follow-up question if exists
        if (botResponse.followUp) {
          setTimeout(() => {
            addMessage(botResponse.followUp, false, true);
            
            // Add follow-up to history
            conversationHistory.push({
              role: 'bot',
              content: botResponse.followUp,
              isFollowUp: true
            });
          }, 800);
        }
      }, 1000 + Math.random() * 1500);
    }
  
    // Event listeners
    chatIcon.addEventListener('click', function() {
      chatContainer.style.display = 'flex';
      chatIcon.style.display = 'none';
      
      // Show welcome message if first interaction
      if (conversationHistory.length === 0) {
        setTimeout(() => {
          const welcome = knowledgeBase["welcome"];
          addMessage(welcome.response);
          conversationHistory.push({
            role: 'bot',
            content: welcome.response
          });
        }, 500);
      }
    });
  
    minimizeChat.addEventListener('click', function() {
      chatContainer.style.display = 'none';
      chatIcon.style.display = 'flex';
    });
  
    closeChat.addEventListener('click', function() {
      chatContainer.style.display = 'none';
      chatIcon.style.display = 'flex';
    });
  
    sendButton.addEventListener('click', handleUserInput);
  
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleUserInput();
      }
    });
  
    // Suggested questions handlers
    questionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const question = this.textContent;
        userInput.value = question;
        handleUserInput();
      });
    });
  });
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
  