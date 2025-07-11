document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = document.querySelector('.hero-welcome-text');
    const subtitleText = document.querySelector('.hero-subtitle-text');
    
    // Initial setup - hide texts
    welcomeText.style.opacity = '0';
    subtitleText.style.opacity = '0';
    
    // Typewriter effect for Welcome text
    function typeWriter(element, text, speed = 100) {
        element.innerHTML = '';
        element.style.opacity = '1';
        let i = 0;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // After "Welcome" is typed, show subtitle with fade-in effect
                setTimeout(() => {
                    subtitleText.style.opacity = '1';
                    subtitleText.style.transform = 'translateY(0)';
                }, 300);
            }
        }
        
        type();
    }
    
    // Glow pulse effect for Welcome text
    function addGlowEffect(element) {
        element.classList.add('glow-pulse');
    }
    
    // Start animation after a small delay
    setTimeout(() => {
        typeWriter(welcomeText, 'Welcome', 150);
        setTimeout(() => {
            addGlowEffect(welcomeText);
        }, 2000);
    }, 500);
    
    // Grid hover push effect - improved
    const gridItems = document.querySelectorAll('.hero-grid-parent > div');
    
    // Map grid items to their positions (0-4 from left to right)
    const gridPositions = {
        'hero-grid-div2': 0, // leftmost
        'hero-grid-div3': 1,
        'hero-grid-div4': 2, // center
        'hero-grid-div5': 3,
        'hero-grid-div6': 4  // rightmost
    };
    
    gridItems.forEach((item) => {
        item.addEventListener('mouseenter', function() {
            // Clear all effects first
            gridItems.forEach(gridItem => {
                gridItem.classList.remove('grid-hover-active', 'grid-push-strong', 'grid-push-weak');
            });
            
            // Add active class to hovered item
            this.classList.add('grid-hover-active');
            
            // Get the class name to determine position
            const hoveredClass = Array.from(this.classList).find(cls => cls.startsWith('hero-grid-div'));
            const hoveredPosition = gridPositions[hoveredClass];
            
            // Apply push effects to other items
            gridItems.forEach((otherItem) => {
                if (otherItem !== this) {
                    const otherClass = Array.from(otherItem.classList).find(cls => cls.startsWith('hero-grid-div'));
                    const otherPosition = gridPositions[otherClass];
                    const distance = Math.abs(otherPosition - hoveredPosition);
                    
                    if (distance === 1) {
                        // Adjacent items - strong push
                        otherItem.classList.add('grid-push-strong');
                    } else if (distance === 2) {
                        // Second level items - weak push
                        otherItem.classList.add('grid-push-weak');
                    }
                }
            });
        });
        
        item.addEventListener('mouseleave', function() {
            // Remove all push effects
            gridItems.forEach(otherItem => {
                otherItem.classList.remove('grid-hover-active', 'grid-push-strong', 'grid-push-weak');
            });
        });
    });
    
    // Floating animation for subtitle
    function floatingAnimation() {
        subtitleText.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Start floating after subtitle appears
    setTimeout(() => {
        floatingAnimation();
    }, 3000);
    
    // Enhanced navbar scroll behavior
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar-pokegotchi');
    const heroSection = document.querySelector('.hero-section');
    
    if (navbar && heroSection) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class for styling changes
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide navbar when scrolling down, show when scrolling up
            if (scrollTop > 100) { // Start hiding after 100px scroll
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    // Scrolling down - hide navbar
                    navbar.classList.add('navbar-hidden');
                } else if (scrollTop < lastScrollTop) {
                    // Scrolling up - show navbar
                    navbar.classList.remove('navbar-hidden');
                }
            } else {
                // Near top - always show navbar
                navbar.classList.remove('navbar-hidden');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
    }
    
    // Add smooth reveal animation on page load
    window.addEventListener('load', function() {
        if (navbar) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.opacity = '1';
        }
    });
}); 