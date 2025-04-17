// Copy email functionality
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                // Change button text temporarily
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                // Return to original text after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            });
        });
    });
    
    // Initialize tilt effect for cards
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".contact-card"), {
            max: 15,
            speed: 300,
            glare: true,
            "max-glare": 0.5,
        });
    }
    
    // Initialize GSAP animations
    if (typeof gsap !== 'undefined') {
        gsap.from(".contact-card", {
            duration: 0.8,
            opacity: 0,
            y: 50,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top 80%"
            }
        });
        
        gsap.from(".business-hours", {
            duration: 0.8,
            opacity: 0,
            y: 30,
            ease: "power3.out",
            delay: 0.6,
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top 80%"
            }
        });
    }
});