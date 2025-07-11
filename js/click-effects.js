/**
 * Click Effects Handler
 * Creates visual feedback effects when user clicks in the game area
 * Shows ripple animation at click location that disappears after 1 second
 */

function initializeClickEffects() {
    const gameArea = document.getElementById('gameArea');
    
    if (!gameArea) {
        console.error('Game area element not found');
        return;
    }

    // Add click event listener for effects
    gameArea.addEventListener('click', function(event) {
        createClickEffect(event);
    });

    /**
     * Creates a visual click effect at the specified coordinates
     * @param {Event} event - The click event containing coordinates
     */
    function createClickEffect(event) {
        const rect = gameArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Create effect element
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        
        // Position the effect at click location
        effect.style.left = (x - 15) + 'px'; // Center the 30px wide effect
        effect.style.top = (y - 15) + 'px';  // Center the 30px high effect
        
        // Add to game area
        gameArea.appendChild(effect);

        // Remove effect after animation completes
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000); // 1 second as specified
    }

    /**
     * Creates a custom effect with specific properties
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Effect color (optional)
     * @param {number} size - Effect size (optional)
     */
    function createCustomEffect(x, y, color = '#f2cc8f', size = 30) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        
        // Custom styling
        effect.style.left = (x - size/2) + 'px';
        effect.style.top = (y - size/2) + 'px';
        effect.style.width = size + 'px';
        effect.style.height = size + 'px';
        effect.style.borderColor = color;
        
        gameArea.appendChild(effect);

        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }

    /**
     * Creates a success effect (green) at Pokemon location
     */
    function createSuccessEffect() {
        const pokemonSprite = document.getElementById('pokemonSprite');
        if (!pokemonSprite) return;

        const rect = pokemonSprite.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        
        const x = rect.left - gameRect.left + rect.width / 2;
        const y = rect.top - gameRect.top + rect.height / 2;
        
        createCustomEffect(x, y, '#7ED321', 40);
    }

    /**
     * Creates a failure effect (red) at Pokemon location
     */
    function createFailureEffect() {
        const pokemonSprite = document.getElementById('pokemonSprite');
        if (!pokemonSprite) return;

        const rect = pokemonSprite.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        
        const x = rect.left - gameRect.left + rect.width / 2;
        const y = rect.top - gameRect.top + rect.height / 2;
        
        createCustomEffect(x, y, '#e07a5f', 35);
    }

    /**
     * Creates multiple sparkle effects around a point
     * @param {number} centerX - Center X coordinate
     * @param {number} centerY - Center Y coordinate
     */
    function createSparkleEffect(centerX, centerY) {
        const sparkleCount = 5;
        const sparkleRadius = 40;
        
        for (let i = 0; i < sparkleCount; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / sparkleCount;
                const x = centerX + Math.cos(angle) * sparkleRadius;
                const y = centerY + Math.sin(angle) * sparkleRadius;
                
                createCustomEffect(x, y, '#FFD700', 20);
            }, i * 100); // Stagger the sparkles
        }
    }

    /**
     * Creates a trail effect following mouse movement
     * @param {Event} event - Mouse move event
     */
    function createTrailEffect(event) {
        const rect = gameArea.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Only create trail if mouse is moving fast enough
        if (event.movementX || event.movementY) {
            createCustomEffect(x, y, '#f2cc8f', 15);
        }
    }

    /**
     * Enables mouse trail effects (optional feature)
     */
    function enableMouseTrail() {
        let trailActive = false;
        
        gameArea.addEventListener('mousedown', () => {
            trailActive = true;
        });
        
        gameArea.addEventListener('mouseup', () => {
            trailActive = false;
        });
        
        gameArea.addEventListener('mousemove', (event) => {
            if (trailActive) {
                createTrailEffect(event);
            }
        });
    }

    /**
     * Creates a celebration effect when Pokemon reaches target
     */
    function createCelebrationEffect() {
        const pokemonSprite = document.getElementById('pokemonSprite');
        if (!pokemonSprite) return;

        const rect = pokemonSprite.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        
        const centerX = rect.left - gameRect.left + rect.width / 2;
        const centerY = rect.top - gameRect.top + rect.height / 2;
        
        createSparkleEffect(centerX, centerY);
    }

    // Make functions available globally for other modules
    window.createClickEffect = createClickEffect;
    window.createCustomEffect = createCustomEffect;
    window.createSuccessEffect = createSuccessEffect;
    window.createFailureEffect = createFailureEffect;
    window.createSparkleEffect = createSparkleEffect;
    window.createCelebrationEffect = createCelebrationEffect;
    window.enableMouseTrail = enableMouseTrail;

    // Auto-enable mouse trail for enhanced interactivity
    // enableMouseTrail(); // Uncomment if you want mouse trail effects
} 