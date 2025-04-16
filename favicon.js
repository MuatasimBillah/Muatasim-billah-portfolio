// MB Full-screen Preloader (Internet Speed Based)
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
          background: #121212;
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
          background: linear-gradient(to right, #9d4edd, #7209b7);
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
        gradient.addColorStop(0, '#9d4edd');
        gradient.addColorStop(1, '#7209b7');
        
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
    
    // Track loading progress
    trackProgress: function() {
      let progressBar = document.getElementById('mb-progress-bar');
      
      // Create a list of resources that need to be loaded
      const resources = Array.from(document.querySelectorAll('img, script, link[rel="stylesheet"]'));
      let loadedResources = 0;
      
      // Function to update progress bar
      function updateProgress() {
        loadedResources++;
        const progressPercent = (loadedResources / resources.length) * 100;
        
        if (progressBar) {
          progressBar.style.width = `${progressPercent}%`;
        }
        
        // If all resources are loaded, we're at 100%
        if (loadedResources >= resources.length) {
          if (progressBar) {
            progressBar.style.width = '100%';
          }
        }
      }
      
      // Track all resources
      resources.forEach(resource => {
        // If the resource has already loaded, count it
        if (resource.complete || resource.readyState === 4) {
          updateProgress();
        } else {
          // Otherwise, wait for it to load
          resource.addEventListener('load', updateProgress);
          resource.addEventListener('error', updateProgress); // Count errors too
        }
      });
      
      // If no resources found or few resources, simulate progress
      if (resources.length < 5) {
        let fakeProgress = 0;
        const interval = setInterval(() => {
          fakeProgress += 5;
          if (progressBar) {
            progressBar.style.width = `${fakeProgress}%`;
          }
          if (fakeProgress >= 100) {
            clearInterval(interval);
          }
        }, 100);
      }
    },
    
    // Hide preloader when page is loaded
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
    
    // Start tracking resource loading progress 
    mbPreloader.trackProgress();
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
      // Hide immediately when loaded - no artificial delay
      mbPreloader.hide();
    });
  });