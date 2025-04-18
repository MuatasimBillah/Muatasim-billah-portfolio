// Initialize Theme Toggle
function initThemeToggle() {
    const toggleInput = document.getElementById('theme-toggle-input');
    const body = document.body;
    
    // Check if user previously enabled light mode
    const isLightMode = body.classList.contains('light-theme');
    toggleInput.checked = isLightMode;
    
    // Toggle theme when the switch is clicked
    toggleInput.addEventListener('change', function() {
      if (this.checked) {
        body.classList.add('light-theme');
      } else {
        body.classList.remove('light-theme');
      }
    });
  }
  
  // Make sure to add back the function call in your DOMContentLoaded event:
  document.addEventListener('DOMContentLoaded', () => {
    // ... other initializations
    
    // Initialize Theme Toggle
    initThemeToggle();
    
    // ... other code
  });