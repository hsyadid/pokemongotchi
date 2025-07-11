// Navbar Scroll Animation System
// Hides navbar when scrolling down, shows when scrolling up

(function() {
    let lastScrollTop = 0;
    let scrollThreshold = 50; // Minimum scroll distance to trigger animation
    let isNavbarHidden = false;
    
    const navbar = document.querySelector('.navbar-pokegotchi');
    if (!navbar) return;
    
    // Throttle function to limit scroll event frequency
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    function handleScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Prevent issues when scroll bounces at top
        if (currentScrollTop < 0) return;
        
        // If we haven't scrolled enough, don't do anything
        if (Math.abs(currentScrollTop - lastScrollTop) < scrollThreshold) return;
        
        // Calculate 50% of page height for index.html, or use 200px for other pages
        const pageHeight = document.body.scrollHeight - window.innerHeight;
        const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
        const triggerPoint = isIndexPage ? pageHeight * 0.5 : 200;
        
        if (currentScrollTop > lastScrollTop && currentScrollTop > triggerPoint) {
            // Scrolling down - hide navbar
            if (!isNavbarHidden) {
                navbar.classList.add('navbar-hidden');
                isNavbarHidden = true;
            }
        } else {
            // Scrolling up - show navbar
            if (isNavbarHidden) {
                navbar.classList.remove('navbar-hidden');
                isNavbarHidden = false;
            }
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    // Add scroll event listener with throttling
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // Also handle resize events to recalculate positions
    window.addEventListener('resize', throttle(() => {
        lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    }, 250));
})(); 