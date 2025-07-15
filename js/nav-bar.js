// What's New Badge Functionality - Clean Version
document.addEventListener('DOMContentLoaded', function() {
  const whatsNewBadge = document.getElementById('whatsNewBadge');
  
  if (whatsNewBadge) {
    // Click animation effect
    whatsNewBadge.addEventListener('click', function() {
      // Smooth click animation
      this.style.transform = 'translateY(-2px) scale(0.95)';
      
      setTimeout(() => {
        this.style.transform = 'translateY(-5px) scale(1.05)';
        
        setTimeout(() => {
          this.style.transform = 'translateY(-5px) scale(1)';
        }, 150);
      }, 150);
    });
    
    // Show badge with entrance animation
    setTimeout(() => {
      whatsNewBadge.style.opacity = '1';
      whatsNewBadge.style.transform = 'translateY(0) scale(1)';
    }, 1500); // 1.5 seconds after page load
    
    // Optional: Hide notification dot after first click
    whatsNewBadge.addEventListener('click', function() {
      const notificationDot = this.querySelector('.notification-dot');
      if (notificationDot) {
        setTimeout(() => {
          notificationDot.style.display = 'none';
        }, 2000);
      }
    });
  }
});

// Optional: Show/hide badge based on scroll position
window.addEventListener('scroll', function() {
  const whatsNewBadge = document.getElementById('whatsNewBadge');
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  
  if (whatsNewBadge) {
    // Show badge after scrolling a bit
    if (scrollPosition > windowHeight * 0.3) {
      whatsNewBadge.style.opacity = '1';
      whatsNewBadge.style.visibility = 'visible';
    }
  }
});