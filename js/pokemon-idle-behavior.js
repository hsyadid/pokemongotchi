/*Pokemon Idle Behavior System*/

function initializePokemonIdleBehavior() {
    const gameArea = document.getElementById('gameArea');
    const pokemonSprite = document.getElementById('pokemonSprite');
    
    if (!gameArea || !pokemonSprite) {
        console.error('Game area or Pokemon sprite elements not found');
        return;
    }

    let idleTimer = null;
    let lastInteraction = Date.now();
    const idleDelay = 5000;
    
    gameArea.addEventListener('click', function() {
        resetIdleTimer();
    });

    startIdleBehavior();

    function startIdleBehavior() {
        idleTimer = setInterval(() => {
            const timeSinceLastInteraction = Date.now() - lastInteraction;
            
            if (timeSinceLastInteraction >= idleDelay && !window.isMoving()) {
                performIdleMovement();
                resetIdleTimer();
            }
        }, 1000);
    }

    function resetIdleTimer() {
        lastInteraction = Date.now();
    }

    function performIdleMovement() {
        if (window.isMoving()) return;

        const gameAreaRect = gameArea.getBoundingClientRect();
        const spriteWidth = pokemonSprite.offsetWidth;
        const spriteHeight = pokemonSprite.offsetHeight;
        const maxX = gameArea.offsetWidth - spriteWidth;
        const maxY = gameArea.offsetHeight - spriteHeight;

        let targetX, targetY;

        if (window.pokemonData.canFlySwim) {
            targetX = Math.random() * maxX;
            targetY = Math.random() * maxY;
        } else {
            const groundLevel = gameArea.offsetHeight * 0.6;
            targetX = Math.random() * maxX;
            targetY = groundLevel + Math.random() * (maxY - groundLevel);
        }

        const currentPos = window.getCurrentPosition();
        
        const maxDistance = getMaxIdleDistance();
        const distance = Math.sqrt(Math.pow(targetX - currentPos.x, 2) + Math.pow(targetY - currentPos.y, 2));
        
        if (distance > maxDistance) {
            const ratio = maxDistance / distance;
            targetX = currentPos.x + (targetX - currentPos.x) * ratio;
            targetY = currentPos.y + (targetY - currentPos.y) * ratio;
        }

        const minDistance = 50;
        if (distance < minDistance) {
            const angle = Math.random() * 2 * Math.PI;
            targetX = currentPos.x + Math.cos(angle) * minDistance;
            targetY = currentPos.y + Math.sin(angle) * minDistance;
            
            targetX = Math.max(0, Math.min(targetX, maxX));
            targetY = Math.max(0, Math.min(targetY, maxY));
            
            if (!window.pokemonData.canFlySwim) {
                const groundLevel = gameArea.offsetHeight * 0.6;
                targetY = Math.max(groundLevel, targetY);
            }
        }

        performIdleMovementAnimation(targetX, targetY);
    }

    function getMaxIdleDistance() {
        const baseDistance = 150;
        const speedMultiplier = window.pokemonData.movementSpeed || 1;
        
        switch(window.pokemonData.type) {
            case 'sky':
                return baseDistance * 1.5 * speedMultiplier;
            case 'underwater':
                return baseDistance * 1.3 * speedMultiplier;
            case 'beach':
            case 'jungle':
            case 'flat':
                return baseDistance * 0.8 * speedMultiplier;
            default:
                return baseDistance * speedMultiplier;
        }
    }

    function performIdleMovementAnimation(targetX, targetY) {
        window.setMoving(true);
        
        const currentPos = window.getCurrentPosition();
        
        if (targetX > currentPos.x) {
            pokemonSprite.classList.add('flipped');
        } else if (targetX < currentPos.x) {
            pokemonSprite.classList.remove('flipped');
        }
        
        pokemonSprite.src = window.pokemonData.animatedSprite;

        const distance = Math.sqrt(Math.pow(targetX - currentPos.x, 2) + Math.pow(targetY - currentPos.y, 2));
        const baseSpeed = window.pokemonData.movementSpeed || 1;
        const duration = Math.min(2000, Math.max(800, distance * baseSpeed * 1.5));

        pokemonSprite.style.transition = `all ${duration}ms ease-in-out`;
        pokemonSprite.style.left = targetX + 'px';
        pokemonSprite.style.top = targetY + 'px';

        window.updatePosition(targetX, targetY);

        setTimeout(() => {
            window.setMoving(false);
            pokemonSprite.style.transition = '';
        }, duration);

        const nextMovementDelay = 2000 + Math.random() * 4000;
        setTimeout(() => {
            resetIdleTimer();
        }, nextMovementDelay);
    }

    function performIdleAnimation() {
        if (window.isMoving()) return;

        if (Math.random() < 0.3) {
            pokemonSprite.src = window.pokemonData.animatedSprite;
        }
    }

    setInterval(performIdleAnimation, 8000 + Math.random() * 7000);

    function stopIdleBehavior() {
        if (idleTimer) {
            clearInterval(idleTimer);
            idleTimer = null;
        }
    }

    window.stopIdleBehavior = stopIdleBehavior;
} 