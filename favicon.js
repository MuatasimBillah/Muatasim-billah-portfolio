// Modern Stylish Preloader with Particle Effect and Simple Bold Purple MB Favicon
const modernPreloader = {
  // Create preloader DOM elements
  create: function() {
    // Add favicon first
    this.addFavicon();
    
    // Create the preloader container
    const preloader = document.createElement('div');
    preloader.id = 'mb-preloader';
    
    // Create the container for particles
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particleContainer.appendChild(particle);
    }
    
    // Create central logo container
    const logoWrapper = document.createElement('div');
    logoWrapper.className = 'logo-wrapper';
    
    // Create pulsating logo circle
    const logoCircle = document.createElement('div');
    logoCircle.className = 'logo-circle';
    
    // Create logo text
    const logoText = document.createElement('div');
    logoText.className = 'logo-text';
    logoText.innerHTML = 'MB';
    
    // Create circular progress indicator
    const progressCircle = document.createElement('div');
    progressCircle.className = 'progress-circle';
    
    // Create loading text
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.innerHTML = 'Loading<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span>';
    
    // Append elements
    logoCircle.appendChild(logoText);
    logoWrapper.appendChild(logoCircle);
    logoWrapper.appendChild(progressCircle);
    
    preloader.appendChild(particleContainer);
    preloader.appendChild(logoWrapper);
    preloader.appendChild(loadingText);
    
    // Add preloader to body
    document.body.appendChild(preloader);
    
    // Add preloader styles
    this.addStyles();
    
    // Initialize particles
    this.initParticles();
    
    return preloader;
  },
  
  // Add favicon to the page
  addFavicon: function() {
    // Create favicon SVG content - Simple, bold MB on purple background
    const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <!-- Purple Background -->
      <rect width="100" height="100" fill="#7000ff" />
      
      <!-- Bold MB Text -->
      <text x="50" y="62" 
            font-family="Arial, sans-serif" 
            font-size="46" 
            font-weight="900"
            text-anchor="middle" 
            fill="white">MB</text>
    </svg>`;
    
    // Convert SVG to a data URI
    const svgBase64 = btoa(faviconSvg);
    const faviconUrl = `data:image/svg+xml;base64,${svgBase64}`;
    
    // Create or update the favicon link elements
    this.createFaviconLink('icon', 'image/svg+xml', faviconUrl);
    
    // Create theme color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]') || document.createElement('meta');
    themeColorMeta.setAttribute('name', 'theme-color');
    themeColorMeta.setAttribute('content', '#7000ff');
    if (!document.querySelector('meta[name="theme-color"]')) {
      document.head.appendChild(themeColorMeta);
    }
  },
  
  // Helper function to create favicon link elements
  createFaviconLink: function(rel, type, href) {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.type = type;
    link.href = href;
  },
  
  // Add required CSS styles
  addStyles: function() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      #mb-preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0c0c14 0%, #16161f 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.6s, visibility 0.6s;
        overflow: hidden;
      }
      
      .particle-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .particle {
        position: absolute;
        background: linear-gradient(to right, rgba(112, 0, 255, 0.8), rgba(0, 217, 255, 0.8));
        border-radius: 50%;
        z-index: 1;
        opacity: 0;
        animation: particleAnimation 4s infinite;
      }
      
      @keyframes particleAnimation {
        0% {
          transform: scale(0) translate(0, 0);
          opacity: 0;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          transform: scale(1) translate(var(--tx), var(--ty));
          opacity: 0;
        }
      }
      
      .logo-wrapper {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 40px;
      }
      
      .logo-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7000ff 0%, #9a4eff 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 0 30px rgba(112, 0, 255, 0.6);
        animation: pulsate 2s infinite ease-in-out;
      }
      
      @keyframes pulsate {
        0% { transform: scale(1); box-shadow: 0 0 30px rgba(112, 0, 255, 0.6); }
        50% { transform: scale(1.05); box-shadow: 0 0 40px rgba(112, 0, 255, 0.8); }
        100% { transform: scale(1); box-shadow: 0 0 30px rgba(112, 0, 255, 0.6); }
      }
      
      .logo-text {
        color: #ffffff;
        font-family: 'Poppins', sans-serif;
        font-weight: 700;
        font-size: 48px;
        letter-spacing: -1px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }
      
      .progress-circle {
        position: absolute;
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top: 3px solid #00d9ff;
        animation: spin 1.5s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .loading-text {
        font-family: 'Inter', sans-serif;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
        letter-spacing: 3px;
        text-transform: uppercase;
        margin-top: 30px;
        font-weight: 500;
      }
      
      .dot-1, .dot-2, .dot-3 {
        opacity: 0;
        animation: dotFade 1.5s infinite;
      }
      
      .dot-2 {
        animation-delay: 0.5s;
      }
      
      .dot-3 {
        animation-delay: 1s;
      }
      
      @keyframes dotFade {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      
      #mb-preloader.fade-out {
        opacity: 0;
        visibility: hidden;
      }
      
      @media (max-width: 768px) {
        .logo-circle {
          width: 100px;
          height: 100px;
        }
        
        .logo-text {
          font-size: 40px;
        }
        
        .progress-circle {
          width: 130px;
          height: 130px;
        }
      }
    `;
    document.head.appendChild(styleEl);
  },
  
  // Initialize particles
  initParticles: function() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
      // Random size
      const size = Math.random() * 15 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      // Random translation
      const translateX = (Math.random() - 0.5) * 200;
      const translateY = (Math.random() - 0.5) * 200;
      particle.style.setProperty('--tx', `${translateX}px`);
      particle.style.setProperty('--ty', `${translateY}px`);
      
      // Random delay
      const delay = Math.random() * 4;
      particle.style.animationDelay = `${delay}s`;
    });
  },
  
  // Fixed progress animation (4-5 seconds)
  animateFixedProgress: function() {
    const duration = 4500; // 4.5 seconds
    
    // Hide preloader after 4.5 seconds (+ 0.5s for fade out = 5 seconds total)
    setTimeout(() => {
      this.hide();
    }, duration);
  },
  
  // Hide preloader
  hide: function() {
    const preloader = document.getElementById('mb-preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      
      // Remove preloader from DOM after fade out
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 600);
    }
  }
};

// Initialize preloader when DOM starts loading
document.addEventListener('DOMContentLoaded', function() {
  // Create preloader immediately
  const preloader = modernPreloader.create();
  
  // Start fixed progress animation (4-5 seconds)
  modernPreloader.animateFixedProgress();
});