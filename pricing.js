document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabIndicator = document.querySelector('.tab-indicator');
  
    // Initialize Tab Indicator Position
    if (tabs.length > 0 && tabIndicator) {
      const activeTab = document.querySelector('.tab.active');
      tabIndicator.style.width = `${activeTab.offsetWidth}px`;
      tabIndicator.style.left = `${activeTab.offsetLeft}px`;
    }
  
    // Tab Click Event
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update Active Tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update Tab Indicator
        tabIndicator.style.width = `${tab.offsetWidth}px`;
        tabIndicator.style.left = `${tab.offsetLeft}px`;
        
        // Show Corresponding Content
        const tabId = tab.getAttribute('data-tab');
        tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === tabId) {
            content.classList.add('active');
          }
        });
      });
    });
  
    // 3D Card Effect
    const cards = document.querySelectorAll('.price-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', handleCardHover);
      card.addEventListener('mouseleave', resetCardPosition);
    });
    
    function handleCardHover(e) {
      const card = this;
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Calculate rotation based on mouse position
      const rotateY = (mouseX - cardCenterX) / 20;
      const rotateX = (cardCenterY - mouseY) / 20;
      
      // Apply transformation
      card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      // Adjust glow position
      const glow = card.querySelector('.glow');
      if (glow) {
        const percentX = (mouseX - cardRect.left) / cardRect.width * 100;
        const percentY = (mouseY - cardRect.top) / cardRect.height * 100;
        glow.style.backgroundImage = `radial-gradient(circle at ${percentX}% ${percentY}%, ${getGlowColor(card)}, rgba(0, 0, 0, 0) 70%)`;
      }
    }
    
    function resetCardPosition() {
      const card = this;
      card.style.transform = card.classList.contains('featured') 
        ? 'translateY(-10px) scale(1.03)' 
        : 'translateY(0) rotateX(0) rotateY(0)';
      
      // Reset glow position
      const glow = card.querySelector('.glow');
      if (glow) {
        glow.style.backgroundImage = `radial-gradient(circle at 50% 0%, ${getGlowColor(card)}, rgba(0, 0, 0, 0) 70%)`;
      }
    }
    
    function getGlowColor(card) {
      const tier = card.getAttribute('data-tier');
      
      if (tier === 'silver') {
        return 'rgba(192, 192, 192, 0.4)';
      } else if (tier === 'gold') {
        return 'rgba(255, 215, 0, 0.4)';
      } else if (tier === 'diamond') {
        return 'rgba(185, 242, 255, 0.4)';
      } else {
        return 'rgba(112, 0, 255, 0.4)';
      }
    }
  
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => {
          faq.classList.remove('active');
        });
        
        // Toggle current item if it wasn't active before
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  
    // GSAP Animations (if GSAP is available)
    if (typeof gsap !== 'undefined') {
      // Hero section animations
      gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
      
      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      });
      
      // Particle animations
      gsap.to('.particle:nth-child(1)', {
        x: '20%',
        y: '10%',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      gsap.to('.particle:nth-child(2)', {
        x: '-15%',
        y: '-15%',
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      gsap.to('.particle:nth-child(3)', {
        x: '15%',
        y: '5%',
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      gsap.to('.particle:nth-child(4)', {
        x: '-10%',
        y: '10%',
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      gsap.to('.particle:nth-child(5)', {
        x: '12%',
        y: '-12%',
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      // Pricing card animations with ScrollTrigger
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.utils.toArray('.price-card').forEach((card, i) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=100',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.7,
            delay: i * 0.15,
            ease: 'back.out(1.7)'
          });
        });
        
        // FAQ items animation
        gsap.utils.toArray('.faq-item').forEach((item, i) => {
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: 'top bottom-=50',
              toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 0.5,
            delay: i * 0.1,
            ease: 'power2.out'
          });
        });
        
        // CTA section animation
        gsap.from('.cta-content', {
          scrollTrigger: {
            trigger: '.cta-section',
            start: 'top bottom-=100',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power2.out'
        });
      }
    }
  });