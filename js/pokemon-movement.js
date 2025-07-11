/*Pokemon Movement Handler*/

function initializePokemonMovement() {
    const gameArea = document.getElementById('gameArea');
    const pokemonSprite = document.getElementById('pokemonSprite');
    
    if (!gameArea || !pokemonSprite) {
        console.error('Game area or Pokemon sprite elements not found');
        return;
    }

    let isMoving = false;
    let currentX = 100;
    let currentY = 350;
    
    pokemonSprite.style.left = currentX + 'px';
    pokemonSprite.style.top = currentY + 'px';
    pokemonSprite.classList.remove('flipped');

    gameArea.addEventListener('click', function(event) {
        if (isMoving) return;
        
        const rect = gameArea.getBoundingClientRect();
        const targetX = event.clientX - rect.left - (pokemonSprite.offsetWidth / 2);
        const targetY = event.clientY - rect.top - (pokemonSprite.offsetHeight / 2);
        
        movePokemonTo(targetX, targetY);
    });

    function movePokemonTo(targetX, targetY) {
        const gameAreaRect = gameArea.getBoundingClientRect();
        const spriteWidth = pokemonSprite.offsetWidth;
        const spriteHeight = pokemonSprite.offsetHeight;
        
        const maxX = gameArea.offsetWidth - spriteWidth;
        const maxY = gameArea.offsetHeight - spriteHeight;
        
        let constrainedX = Math.max(0, Math.min(targetX, maxX));
        let constrainedY = Math.max(0, Math.min(targetY, maxY));
        
        if (!window.pokemonData.canFlySwim) {
            const groundLevel = gameArea.offsetHeight * 0.6;
            constrainedY = Math.max(groundLevel, constrainedY);
        }
        
        const canReach = isPositionReachable(constrainedX, constrainedY, targetX, targetY);
        
        if (canReach) {
            performMovement(constrainedX, constrainedY);
        } else {
            performJumpAnimation();
        }
    }

    function isPositionReachable(constrainedX, constrainedY, originalX, originalY) {
        const tolerance = 50;
        return (Math.abs(constrainedX - originalX) < tolerance && 
                Math.abs(constrainedY - originalY) < tolerance);
    }

    function performMovement(targetX, targetY) {
        isMoving = true;
        
        if (targetX > currentX) {
            pokemonSprite.classList.add('flipped');
        } else if (targetX < currentX) {
            pokemonSprite.classList.remove('flipped');
        }
        
        pokemonSprite.src = window.pokemonData.animatedSprite;
        pokemonSprite.classList.add('jumping');
        
        const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
        const duration = Math.min(1000, Math.max(300, distance * window.pokemonData.movementSpeed));
        
        pokemonSprite.style.transition = `all ${duration}ms ease-in-out`;
        pokemonSprite.style.left = targetX + 'px';
        pokemonSprite.style.top = targetY + 'px';
        
        currentX = targetX;
        currentY = targetY;
        
        setTimeout(() => {
            isMoving = false;
            pokemonSprite.classList.remove('jumping');
            pokemonSprite.style.transition = '';
        }, duration);
    }

    function performJumpAnimation() {
        if (isMoving) return;
        
        isMoving = true;
        pokemonSprite.classList.add('jumping');
        pokemonSprite.src = window.pokemonData.animatedSprite;
        
        setTimeout(() => {
            isMoving = false;
            pokemonSprite.classList.remove('jumping');
        }, 600);
    }

    function getCurrentPosition() {
        return { x: currentX, y: currentY };
    }

    function updatePosition(x, y) {
        currentX = x;
        currentY = y;
        pokemonSprite.style.left = x + 'px';
        pokemonSprite.style.top = y + 'px';
    }

    window.getCurrentPosition = getCurrentPosition;
    window.updatePosition = updatePosition;
    window.isMoving = () => isMoving;
    window.setMoving = (moving) => { isMoving = moving; };
} 