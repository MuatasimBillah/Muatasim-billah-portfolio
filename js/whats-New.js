// What's New Badge - Final Clean Version
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const badge = document.querySelector('.whats-new-floating-badge');
    
    if (badge) {
      // Simple click effect
      badge.addEventListener('click', function() {
        this.style.transform = 'translateY(-4px) scale(0.95)';
        
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      });
      
      // Show badge after page load
      setTimeout(() => {
        badge.style.opacity = '1';
      }, 1000);
    }
  });
})();