// MB Full-screen Preloader (Fixed 4-5 Second Timer)
const mbPreloader = {
    // Create preloader DOM elements
    create: function() {
      // Create the preloader container
      const preloader = document.createElement('div');
      preloader.id = 'mb-preloader';
      
      // Create the logo container
      const logoContainer = document.createElement('div');
      logoContainer.className = 'logo-container';
      
      // Create the logo canvas
      const logoCanvas = document.createElement('canvas');
      logoCanvas.width = 150;
      logoCanvas.height = 150;
      logoCanvas.id = 'logo-canvas';
      
      // Create loading text
      const loadingText = document.createElement('div');
      loadingText.className = 'loading-text';
      loadingText.textContent = 'Loading...';
      
      // Create loading progress bar
      const progressBarContainer = document.createElement('div');
      progressBarContainer.className = 'progress-container';
      
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      progressBar.id = 'mb-progress-bar';
      
      progressBarContainer.appendChild(progressBar);
      
      // Append elements
      logoContainer.appendChild(logoCanvas);
      preloader.appendChild(logoContainer);
      preloader.appendChild(loadingText);
      preloader.appendChild(progressBarContainer);
      
      // Add preloader to body
      document.body.appendChild(preloader);
      
      // Add preloader styles
      this.addStyles();
      
      // Initialize the canvas logo
      this.initLogoCanvas();
      
      return preloader;
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
          background: #12121F;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.5s, visibility 0.5s;
        }
        
        #mb-preloader .logo-container {
          margin-bottom: 20px;
        }
        
        #mb-preloader .loading-text {
          color: #ffffff;
          font-family: 'Arial', sans-serif;
          font-size: 16px;
          letter-spacing: 3px;
          margin-top: 20px;
          opacity: 0.8;
        }
        
        #mb-preloader .progress-container {
          width: 200px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          margin-top: 20px;
          border-radius: 2px;
          overflow: hidden;
        }
        
        #mb-preloader .progress-bar {
          height: 100%;
          width: 0%;
          background: linear-gradient(to right, #7000ff, #9a4eff);
          transition: width 0.3s;
        }
        
        #mb-preloader.fade-out {
          opacity: 0;
          visibility: hidden;
        }
      `;
      document.head.appendChild(styleEl);
    },
    
    // Initialize and animate the logo canvas
    initLogoCanvas: function() {
      const canvas = document.getElementById('logo-canvas');
      const ctx = canvas.getContext('2d');
      let angle = 0;
      
      // Animation function
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Center coordinates
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw purple circle background
        const gradient = ctx.createLinearGradient(
          centerX - 60, centerY - 60, 
          centerX + 60, centerY + 60
        );
        gradient.addColorStop(0, '#7000ff');  // Updated to your primary color
        gradient.addColorStop(1, '#5a00cc');  // Updated to your primary-dark color
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw loading animation
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        // Draw animated arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, 70, angle, angle + Math.PI * 1.5);
        ctx.stroke();
        
        // Draw MB text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MB', centerX, centerY);
        
        // Update angle for next frame
        angle += 0.05;
        
        // Request next animation frame if preloader is still visible
        const preloader = document.getElementById('mb-preloader');
        if (preloader && !preloader.classList.contains('fade-out')) {
          requestAnimationFrame(animate);
        }
      }
      
      // Start animation
      animate();
    },
    
    // Fixed progress animation (4-5 seconds)
    animateFixedProgress: function() {
      const progressBar = document.getElementById('mb-progress-bar');
      const duration = 4500; // 4.5 seconds
      const startTime = Date.now();
      
      function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration * 100, 100);
        
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
        }
        
        if (progress < 100) {
          // Continue until 100%
          requestAnimationFrame(updateProgress);
        }
      }
      
      // Start progress animation
      updateProgress();
      
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
        }, 500);
      }
    }
  };
  
  // Initialize preloader when DOM starts loading
  document.addEventListener('DOMContentLoaded', function() {
    // Create preloader immediately
    const preloader = mbPreloader.create();
    
    // Start fixed progress animation (4-5 seconds)
    mbPreloader.animateFixedProgress();
    
    // Remove the load event listener since we're using fixed timing
    // window.addEventListener('load', function() {...});
  });