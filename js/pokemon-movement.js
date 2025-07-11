/**
 * Pokemon Movement Handler
 * Manages Pokemon character movement when user clicks in the game area
 * Handles different movement types based on Pokemon environment type
 */

function initializePokemonMovement() {
    const gameArea = document.getElementById('gameArea');
    const pokemonSprite = document.getElementById('pokemonSprite');
    
    if (!gameArea || !pokemonSprite) {
        console.error('Game area or Pokemon sprite elements not found');
        return;
    }

    let isMoving = false;
    let currentX = 100; // Initial X position
    let currentY = 350; // Initial Y position
    
    // Set initial position and direction
    pokemonSprite.style.left = currentX + 'px';
    pokemonSprite.style.top = currentY + 'px';
    pokemonSprite.classList.remove('flipped'); // Start facing left (normal sprite direction)

    // Add click event listener to game area
    gameArea.addEventListener('click', function(event) {
        if (isMoving) return; // Prevent multiple clicks during movement
        
        const rect = gameArea.getBoundingClientRect();
        const targetX = event.clientX - rect.left - (pokemonSprite.offsetWidth / 2);
        const targetY = event.clientY - rect.top - (pokemonSprite.offsetHeight / 2);
        
        movePokemonTo(targetX, targetY);
    });

    /**
     * Moves Pokemon to the specified coordinates
     * @param {number} targetX - Target X coordinate
     * @param {number} targetY - Target Y coordinate
     */
    function movePokemonTo(targetX, targetY) {
        const gameAreaRect = gameArea.getBoundingClientRect();
        const spriteWidth = pokemonSprite.offsetWidth;
        const spriteHeight = pokemonSprite.offsetHeight;
        
        // Calculate boundaries
        const maxX = gameArea.offsetWidth - spriteWidth;
        const maxY = gameArea.offsetHeight - spriteHeight;
        
        // Constrain coordinates within boundaries
        let constrainedX = Math.max(0, Math.min(targetX, maxX));
        let constrainedY = Math.max(0, Math.min(targetY, maxY));
        
        // Apply movement restrictions based on Pokemon type
        if (!window.pokemonData.canFlySwim) {
            // Ground-based Pokemon can only move in lower area
            const groundLevel = gameArea.offsetHeight * 0.6; // 60% down from top
            constrainedY = Math.max(groundLevel, constrainedY);
        }
        
        // Check if target position is reachable
        const canReach = isPositionReachable(constrainedX, constrainedY, targetX, targetY);
        
        if (canReach) {
            // Move to target position
            performMovement(constrainedX, constrainedY);
        } else {
            // Show jumping animation if unreachable
            performJumpAnimation();
        }
    }

    /**
     * Checks if the target position is reachable for the Pokemon
     * @param {number} constrainedX - Constrained X coordinate
     * @param {number} constrainedY - Constrained Y coordinate
     * @param {number} originalX - Original target X coordinate
     * @param {number} originalY - Original target Y coordinate
     * @returns {boolean} Whether the position is reachable
     */
    function isPositionReachable(constrainedX, constrainedY, originalX, originalY) {
        const tolerance = 50; // Pixels tolerance for "close enough"
        return (Math.abs(constrainedX - originalX) < tolerance && 
                Math.abs(constrainedY - originalY) < tolerance);
    }

    /**
     * Performs the actual movement animation
     * @param {number} targetX - Target X coordinate
     * @param {number} targetY - Target Y coordinate
     */
    function performMovement(targetX, targetY) {
        isMoving = true;
        
        // Determine direction and flip Pokemon accordingly
        // Pokemon sprites face left by default, so flip when moving right
        if (targetX > currentX) {
            // Moving right - flip to face right
            pokemonSprite.classList.add('flipped');
        } else if (targetX < currentX) {
            // Moving left - face normal direction (left)
            pokemonSprite.classList.remove('flipped');
        }
        
        // Ensure animated sprite is used
        pokemonSprite.src = window.pokemonData.animatedSprite;
        
        // Add jumping animation class
        pokemonSprite.classList.add('jumping');
        
        // Calculate movement duration based on distance
        const distance = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
        const duration = Math.min(1000, Math.max(300, distance * window.pokemonData.movementSpeed));
        
        // Animate movement
        pokemonSprite.style.transition = `all ${duration}ms ease-in-out`;
        pokemonSprite.style.left = targetX + 'px';
        pokemonSprite.style.top = targetY + 'px';
        
        // Update current position
        currentX = targetX;
        currentY = targetY;
        
        // Reset after movement completes
        setTimeout(() => {
            isMoving = false;
            pokemonSprite.classList.remove('jumping');
            pokemonSprite.style.transition = '';
        }, duration);
    }

    /**
     * Performs jumping animation when target is unreachable
     */
    function performJumpAnimation() {
        if (isMoving) return;
        
        isMoving = true;
        pokemonSprite.classList.add('jumping');
        
        // Ensure animated sprite is used
        pokemonSprite.src = window.pokemonData.animatedSprite;
        
        // Reset after animation
        setTimeout(() => {
            isMoving = false;
            pokemonSprite.classList.remove('jumping');
        }, 600);
    }

    /**
     * Gets current Pokemon position
     * @returns {object} Current position {x, y}
     */
    function getCurrentPosition() {
        return { x: currentX, y: currentY };
    }

    /**
     * Updates Pokemon position programmatically (for idle movement)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    function updatePosition(x, y) {
        currentX = x;
        currentY = y;
        pokemonSprite.style.left = x + 'px';
        pokemonSprite.style.top = y + 'px';
    }

    // Make functions available globally
    window.getCurrentPosition = getCurrentPosition;
    window.updatePosition = updatePosition;
    window.isMoving = () => isMoving;
    window.setMoving = (moving) => { isMoving = moving; };
} 