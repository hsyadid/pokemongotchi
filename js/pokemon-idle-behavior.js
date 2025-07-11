/**
 * Pokemon Idle Behavior Handler
 * Manages automatic Pokemon movement when not interacting with user
 * Provides varying movement patterns and speeds based on Pokemon type
 */

function initializePokemonIdleBehavior() {
    const gameArea = document.getElementById('gameArea');
    const pokemonSprite = document.getElementById('pokemonSprite');
    
    if (!gameArea || !pokemonSprite) {
        console.error('Game area or Pokemon sprite elements not found');
        return;
    }

    let idleTimer = null;
    let lastInteraction = Date.now();
    const idleDelay = 3000; // 3 seconds of inactivity before idle behavior starts
    
    // Track user interactions
    gameArea.addEventListener('click', function() {
        resetIdleTimer();
    });

    // Start idle behavior system
    startIdleBehavior();

    /**
     * Starts the idle behavior monitoring system
     */
    function startIdleBehavior() {
        idleTimer = setInterval(() => {
            const timeSinceLastInteraction = Date.now() - lastInteraction;
            
            if (timeSinceLastInteraction >= idleDelay && !window.isMoving()) {
                performIdleMovement();
                resetIdleTimer();
            }
        }, 1000); // Check every second
    }

    /**
     * Resets the idle timer when user interacts
     */
    function resetIdleTimer() {
        lastInteraction = Date.now();
    }

    /**
     * Performs a random idle movement based on Pokemon type
     */
    function performIdleMovement() {
        if (window.isMoving()) return;

        const gameAreaRect = gameArea.getBoundingClientRect();
        const spriteWidth = pokemonSprite.offsetWidth;
        const spriteHeight = pokemonSprite.offsetHeight;
        const maxX = gameArea.offsetWidth - spriteWidth;
        const maxY = gameArea.offsetHeight - spriteHeight;

        let targetX, targetY;

        // Generate movement based on Pokemon type
        if (window.pokemonData.canFlySwim) {
            // Flying/Swimming Pokemon can move anywhere
            targetX = Math.random() * maxX;
            targetY = Math.random() * maxY;
        } else {
            // Ground Pokemon stay in lower area
            const groundLevel = gameArea.offsetHeight * 0.6;
            targetX = Math.random() * maxX;
            targetY = groundLevel + Math.random() * (maxY - groundLevel);
        }

        // Get current position
        const currentPos = window.getCurrentPosition();
        
        // Ensure movement is noticeable but not too far
        const maxDistance = getMaxIdleDistance();
        const distance = Math.sqrt(Math.pow(targetX - currentPos.x, 2) + Math.pow(targetY - currentPos.y, 2));
        
        if (distance > maxDistance) {
            // Limit the distance
            const ratio = maxDistance / distance;
            targetX = currentPos.x + (targetX - currentPos.x) * ratio;
            targetY = currentPos.y + (targetY - currentPos.y) * ratio;
        }

        // Minimum movement threshold
        const minDistance = 50;
        if (distance < minDistance) {
            // Generate a minimum distance movement
            const angle = Math.random() * 2 * Math.PI;
            targetX = currentPos.x + Math.cos(angle) * minDistance;
            targetY = currentPos.y + Math.sin(angle) * minDistance;
            
            // Keep within bounds
            targetX = Math.max(0, Math.min(targetX, maxX));
            targetY = Math.max(0, Math.min(targetY, maxY));
            
            // Apply ground restrictions if needed
            if (!window.pokemonData.canFlySwim) {
                const groundLevel = gameArea.offsetHeight * 0.6;
                targetY = Math.max(groundLevel, targetY);
            }
        }

        performIdleMovementAnimation(targetX, targetY);
    }

    /**
     * Gets maximum idle movement distance based on Pokemon characteristics
     * @returns {number} Maximum distance in pixels
     */
    function getMaxIdleDistance() {
        const baseDistance = 150;
        const speedMultiplier = window.pokemonData.movementSpeed || 1;
        
        // Different Pokemon types have different idle movement ranges
        switch(window.pokemonData.type) {
            case 'sky':
                return baseDistance * 1.5 * speedMultiplier; // Flying Pokemon move more
            case 'underwater':
                return baseDistance * 1.3 * speedMultiplier; // Swimming Pokemon move freely
            case 'beach':
            case 'jungle':
            case 'flat':
                return baseDistance * 0.8 * speedMultiplier; // Ground Pokemon move less
            default:
                return baseDistance * speedMultiplier;
        }
    }

    /**
     * Performs the idle movement animation
     * @param {number} targetX - Target X coordinate
     * @param {number} targetY - Target Y coordinate
     */
    function performIdleMovementAnimation(targetX, targetY) {
        window.setMoving(true);
        
        // Get current position for direction detection
        const currentPos = window.getCurrentPosition();
        
        // Determine direction and flip Pokemon accordingly
        // Pokemon sprites face left by default, so flip when moving right
        if (targetX > currentPos.x) {
            // Moving right - flip to face right
            pokemonSprite.classList.add('flipped');
        } else if (targetX < currentPos.x) {
            // Moving left - face normal direction (left)
            pokemonSprite.classList.remove('flipped');
        }
        
        // Ensure animated sprite is used
        pokemonSprite.src = window.pokemonData.animatedSprite;

        // Calculate movement duration (slower than user-directed movement)
        const distance = Math.sqrt(Math.pow(targetX - currentPos.x, 2) + Math.pow(targetY - currentPos.y, 2));
        const baseSpeed = window.pokemonData.movementSpeed || 1;
        const duration = Math.min(2000, Math.max(800, distance * baseSpeed * 1.5)); // Slower idle movement

        // Add gentle movement animation
        pokemonSprite.style.transition = `all ${duration}ms ease-in-out`;
        pokemonSprite.style.left = targetX + 'px';
        pokemonSprite.style.top = targetY + 'px';

        // Update position
        window.updatePosition(targetX, targetY);

        // Reset after movement
        setTimeout(() => {
            window.setMoving(false);
            pokemonSprite.style.transition = '';
        }, duration);

        // Add random next movement delay
        const nextMovementDelay = 2000 + Math.random() * 4000; // 2-6 seconds
        setTimeout(() => {
            resetIdleTimer();
        }, nextMovementDelay);
    }

    /**
     * Adds occasional idle animations without movement
     */
    function performIdleAnimation() {
        if (window.isMoving()) return;

        // Random chance for idle animation
        if (Math.random() < 0.3) { // 30% chance
            // Ensure animated sprite is used
            pokemonSprite.src = window.pokemonData.animatedSprite;
        }
    }

    // Occasionally add idle animations
    setInterval(performIdleAnimation, 8000 + Math.random() * 7000); // Every 8-15 seconds

    /**
     * Stops idle behavior (useful for cleanup)
     */
    function stopIdleBehavior() {
        if (idleTimer) {
            clearInterval(idleTimer);
            idleTimer = null;
        }
    }

    // Make stop function available globally
    window.stopIdleBehavior = stopIdleBehavior;
} 