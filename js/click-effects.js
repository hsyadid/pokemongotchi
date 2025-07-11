/*Click Effects System*/

function initializeClickEffects() {
    const gameArea = document.getElementById('gameArea');
    
    if (!gameArea) {
        console.error('Game area element not found for click effects');
        return;
    }

    const effectSettings = {
        duration: 1000,
        maxSize: 100,
        colors: [
            '#f2cc8f',
            '#e07a5f',
            '#3d405b',
            '#81b29a',
            '#f4a261'
        ]
    };

    gameArea.addEventListener('click', function(event) {
        if (event.target === gameArea) {
            createClickEffect(event);
        }
    });

    function createClickEffect(event) {
        const rect = gameArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        
        const randomColor = effectSettings.colors[Math.floor(Math.random() * effectSettings.colors.length)];
        const effectSize = 20 + Math.random() * 30;
        
        effect.style.left = (x - effectSize / 2) + 'px';
        effect.style.top = (y - effectSize / 2) + 'px';
        effect.style.width = effectSize + 'px';
        effect.style.height = effectSize + 'px';
        effect.style.borderColor = randomColor;
        effect.style.position = 'absolute';
        effect.style.borderRadius = '50%';
        effect.style.border = '3px solid';
        effect.style.backgroundColor = 'transparent';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '15';
        
        const animationDuration = effectSettings.duration + Math.random() * 500;
        effect.style.animation = `clickRipple ${animationDuration}ms ease-out forwards`;
        
        gameArea.appendChild(effect);
        
        setTimeout(() => {
            if (effect && effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, animationDuration + 100);
    }

    function createMultipleEffects(x, y, count = 3) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const offsetX = x + (Math.random() - 0.5) * 40;
                const offsetY = y + (Math.random() - 0.5) * 40;
                
                const fakeEvent = {
                    clientX: offsetX + gameArea.getBoundingClientRect().left,
                    clientY: offsetY + gameArea.getBoundingClientRect().top,
                    target: gameArea
                };
                
                createClickEffect(fakeEvent);
            }, i * 150);
        }
    }

    function createEffectAtPosition(x, y) {
        const rect = gameArea.getBoundingClientRect();
        const fakeEvent = {
            clientX: x + rect.left,
            clientY: y + rect.top,
            target: gameArea
        };
        createClickEffect(fakeEvent);
    }

    function setEffectSettings(newSettings) {
        Object.assign(effectSettings, newSettings);
    }

    window.createClickEffectAt = createEffectAtPosition;
    window.createMultipleClickEffects = createMultipleEffects;
    window.setClickEffectSettings = setEffectSettings;
} 