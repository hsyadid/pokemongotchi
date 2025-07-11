/*Navbar Scroll Animation System*/

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar-pokegotchi');
    if (!navbar) return;

    let lastScrollTop = 0;
    let scrollTimeout;
    const scrollThreshold = 10;
    
    const isIndexPage = window.location.pathname === '/' || 
                       window.location.pathname.includes('index.html') ||
                       (!window.location.pathname.includes('_page.html') && 
                        window.location.pathname.split('/').pop() === '');

    const triggerHeight = isIndexPage ? 
        () => window.innerHeight * 0.5 : 
        () => 200;

    function handleScroll() {
        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) {
                return;
            }

            if (scrollTop > triggerHeight()) {
                if (scrollTop > lastScrollTop) {
                    navbar.classList.add('navbar-hidden');
                } else {
                    navbar.classList.remove('navbar-hidden');
                }
            } else {
                navbar.classList.remove('navbar-hidden');
            }

            lastScrollTop = scrollTop;
        }, 10);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    handleScroll();
}); 