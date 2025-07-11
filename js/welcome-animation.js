/*Welcome Animation System*/

document.addEventListener('DOMContentLoaded', function() {
    const welcomeText = document.querySelector('.hero-welcome-text');
    const subtitleText = document.querySelector('.hero-subtitle-text');
    
    if (!welcomeText || !subtitleText) return;

    const gridDivs = document.querySelectorAll('.hero-grid-parent > div');
    
    let animationActive = true;

    function typewriterAnimation(element, text, speed = 150) {
        element.textContent = '';
        element.classList.remove('typing-complete');
        
        let index = 0;
        const timer = setInterval(() => {
            element.textContent += text[index];
            index++;
            
            if (index >= text.length) {
                clearInterval(timer);
                element.classList.add('typing-complete');
                
                setTimeout(() => {
                    showSubtitle();
                }, 500);
            }
        }, speed);
    }

    function showSubtitle() {
        subtitleText.style.transform = 'translateY(0)';
        subtitleText.style.opacity = '1';
        
        setTimeout(() => {
            subtitleText.classList.add('glow-pulse');
        }, 800);
    }

    function startWelcomeAnimation() {
        welcomeText.style.opacity = '1';
        subtitleText.style.opacity = '0';
        subtitleText.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            typewriterAnimation(welcomeText, 'Welcome', 150);
        }, 1000);
    }

    function handleGridHover(hoveredDiv) {
        if (!animationActive) return;
        
        const allDivs = Array.from(gridDivs);
        const hoveredIndex = allDivs.indexOf(hoveredDiv);
        
        allDivs.forEach((div, index) => {
            div.classList.remove('grid-hover-active', 'grid-push-strong', 'grid-push-weak');
            
            if (index === hoveredIndex) {
                div.classList.add('grid-hover-active');
            } else {
                const distance = Math.abs(index - hoveredIndex);
                if (distance === 1) {
                    div.classList.add('grid-push-weak');
                } else {
                    div.classList.add('grid-push-strong');
                }
            }
        });
    }

    function resetGridAnimations() {
        gridDivs.forEach(div => {
            div.classList.remove('grid-hover-active', 'grid-push-strong', 'grid-push-weak');
        });
    }

    gridDivs.forEach(div => {
        div.addEventListener('mouseenter', () => handleGridHover(div));
        div.addEventListener('mouseleave', resetGridAnimations);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero-grid-parent')) {
            animationActive = false;
            resetGridAnimations();
        }
    });

    startWelcomeAnimation();
}); 