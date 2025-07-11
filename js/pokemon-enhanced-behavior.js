// Enhanced Pokemon Interactive Behavior System
// Provides dynamic movement patterns, flipping, and various animations

function initializeEnhancedPokemonBehavior() {
    const pokemon = document.getElementById('pokemonSprite');
    const gameArea = document.getElementById('gameArea');
    
    if (!pokemon || !gameArea) return;

    // Pokemon state variables
    let isMoving = false;
    let currentDirection = 'right';
    let activityLevel = Math.random() * 100; // 0-100, determines how active the Pokemon is
    let lastActivity = Date.now();
    let moodCycle = 0;

    // Get game area dimensions
    const getGameAreaBounds = () => {
        const rect = gameArea.getBoundingClientRect();
        const pokemonRect = pokemon.getBoundingClientRect();
        return {
            width: gameArea.offsetWidth - pokemonRect.width,
            height: gameArea.offsetHeight - pokemonRect.height
        };
    };

    // Get movement constraints based on Pokemon environment
    const getMovementConstraints = () => {
        // Try to get type from pokemonData first, then from gameArea class as fallback
        let pokemonType = window.pokemonData?.type;
        if (!pokemonType) {
            const gameAreaClasses = gameArea.className;
            if (gameAreaClasses.includes('sky')) pokemonType = 'sky';
            else if (gameAreaClasses.includes('underwater')) pokemonType = 'underwater';
            else if (gameAreaClasses.includes('beach')) pokemonType = 'beach';
            else if (gameAreaClasses.includes('jungle')) pokemonType = 'jungle';
            else pokemonType = 'flat';
        }
        
        const bounds = getGameAreaBounds();
        
        // Sky and underwater Pokemon can move freely in entire area
        if (pokemonType === 'sky' || pokemonType === 'underwater') {
            return {
                minX: 0,
                maxX: bounds.width,
                minY: 0,
                maxY: bounds.height
            };
        }
        
        // Beach, jungle, and flat Pokemon are restricted to lower ground area
        // This simulates that they cannot fly or swim, so they stay on the ground
        return {
            minX: 0,
            maxX: bounds.width,
            minY: bounds.height * 0.75, // Can only move in bottom 25% of area (ground level)
            maxY: bounds.height * 0.95  // Leave small space from bottom edge
        };
    };

    // Random movement patterns with environment constraints
    const movementPatterns = {
        explore: () => {
            // Random exploration movement within constraints
            const constraints = getMovementConstraints();
            const targetX = constraints.minX + Math.random() * (constraints.maxX - constraints.minX);
            const targetY = constraints.minY + Math.random() * (constraints.maxY - constraints.minY);
            movePokemonTo(targetX, targetY, 2000 + Math.random() * 3000);
        },
        
        patrol: () => {
            // Back and forth patrol within constraints
            const constraints = getMovementConstraints();
            const currentX = parseInt(pokemon.style.left) || 0;
            const targetX = currentX < (constraints.maxX / 2) ? constraints.maxX * 0.8 : constraints.maxX * 0.2;
            const targetY = constraints.minY + Math.random() * (constraints.maxY - constraints.minY);
            movePokemonTo(targetX, targetY, 3000 + Math.random() * 2000);
        },
        
        circle: () => {
            // Circular movement within constraints
            const constraints = getMovementConstraints();
            const centerX = (constraints.minX + constraints.maxX) / 2;
            const centerY = (constraints.minY + constraints.maxY) / 2;
            const maxRadius = Math.min(
                (constraints.maxX - constraints.minX) * 0.3,
                (constraints.maxY - constraints.minY) * 0.3
            );
            const angle = Math.random() * Math.PI * 2;
            const radius = maxRadius * (0.5 + Math.random() * 0.5);
            const targetX = Math.max(constraints.minX, Math.min(constraints.maxX, centerX + Math.cos(angle) * radius));
            const targetY = Math.max(constraints.minY, Math.min(constraints.maxY, centerY + Math.sin(angle) * radius));
            movePokemonTo(targetX, targetY, 2000 + Math.random() * 2000);
        },
        
        corner: () => {
            // Move to accessible corners based on environment
            const constraints = getMovementConstraints();
            const corners = [
                { x: constraints.minX, y: constraints.minY },
                { x: constraints.maxX, y: constraints.minY },
                { x: constraints.minX, y: constraints.maxY },
                { x: constraints.maxX, y: constraints.maxY }
            ];
            const corner = corners[Math.floor(Math.random() * corners.length)];
            movePokemonTo(corner.x, corner.y, 2500 + Math.random() * 2500);
        }
    };

    // Move Pokemon to specific coordinates
    const movePokemonTo = (targetX, targetY, duration) => {
        if (isMoving) return;
        
        isMoving = true;
        const currentX = parseInt(pokemon.style.left) || 0;
        const currentY = parseInt(pokemon.style.top) || 0;
        
        // Determine direction and flip Pokemon accordingly
        // Pokemon sprites face left by default, so flip when moving right
        if (targetX > currentX) {
            // Moving right - flip to face right
            pokemon.classList.add('flipped');
            currentDirection = 'right';
        } else if (targetX < currentX) {
            // Moving left - face normal direction (left)
            pokemon.classList.remove('flipped');
            currentDirection = 'left';
        }
        
        // Add movement class
        pokemon.classList.add('moving');
        
        // Animate to target position
        pokemon.style.transition = `all ${duration}ms ease-in-out`;
        pokemon.style.left = targetX + 'px';
        pokemon.style.top = targetY + 'px';
        
        // Clear movement state after animation
        setTimeout(() => {
            isMoving = false;
            pokemon.classList.remove('moving');
            pokemon.style.transition = '';
            scheduleNextActivity();
        }, duration);
    };



    // Various mood animations
    const moodAnimations = {
        happy: () => {
            pokemon.classList.add('excited');
            setTimeout(() => pokemon.classList.remove('excited'), 2000);
        },
        
        playful: () => {
            pokemon.classList.add('dancing');
            setTimeout(() => pokemon.classList.remove('dancing'), 4000);
        },
        
        tired: () => {
            pokemon.classList.add('sleepy');
            setTimeout(() => pokemon.classList.remove('sleepy'), 6000);
        },
        
        energetic: () => {
            // Multiple quick jumps
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    pokemon.classList.add('jumping');
                    setTimeout(() => pokemon.classList.remove('jumping'), 600);
                }, i * 800);
            }
        }
    };

    // Determine activity based on Pokemon personality and time
    const getActivityFrequency = () => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        const baseFrequency = 3000 + (100 - activityLevel) * 100; // More active Pokemon move more often
        
        // Add some randomness and mood cycles
        moodCycle = (moodCycle + 1) % 100;
        const moodMultiplier = 0.5 + Math.sin(moodCycle * 0.1) * 0.5; // Creates cycles of high/low activity
        
        return baseFrequency * moodMultiplier * (0.5 + Math.random());
    };

    // Schedule next Pokemon activity
    const scheduleNextActivity = () => {
        const frequency = getActivityFrequency();
        
        setTimeout(() => {
            if (!isMoving && document.visibilityState === 'visible') {
                performRandomActivity();
            } else {
                scheduleNextActivity();
            }
        }, frequency);
    };

    // Perform random activity based on Pokemon's personality
    const performRandomActivity = () => {
        lastActivity = Date.now();
        
        // Higher activity level = more likely to move
        const shouldMove = Math.random() * 100 < activityLevel;
        
        if (shouldMove) {
            // Choose random movement pattern
            const patterns = Object.keys(movementPatterns);
            const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
            movementPatterns[randomPattern]();
        } else {
            // Perform mood animation instead
            const moods = Object.keys(moodAnimations);
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            moodAnimations[randomMood]();
            
            // Schedule next activity since we didn't move
            scheduleNextActivity();
        }
    };

    // Handle click interactions
    const handlePokemonClick = (event) => {
        event.stopPropagation();
        
        // Increase activity level temporarily
        activityLevel = Math.min(100, activityLevel + 10);
        
        // Immediate response to click
        if (Math.random() > 0.5) {
            moodAnimations.happy();
        } else {
            pokemon.classList.add('jumping');
            setTimeout(() => pokemon.classList.remove('jumping'), 600);
        }
        
        // Chance to randomly turn direction when clicked
        if (Math.random() > 0.7) {
            setTimeout(() => {
                // Randomly face left or right
                if (Math.random() > 0.5) {
                    pokemon.classList.add('flipped');
                    currentDirection = 'right';
                } else {
                    pokemon.classList.remove('flipped');
                    currentDirection = 'left';
                }
            }, 300);
        }
    };

    // Handle area clicks (move Pokemon to clicked location)
    const handleAreaClick = (event) => {
        if (event.target === gameArea) {
            const rect = gameArea.getBoundingClientRect();
            const clickX = event.clientX - rect.left - pokemon.offsetWidth / 2;
            const clickY = event.clientY - rect.top - pokemon.offsetHeight / 2;
            
            const constraints = getMovementConstraints();
            const targetX = Math.max(constraints.minX, Math.min(constraints.maxX, clickX));
            const targetY = Math.max(constraints.minY, Math.min(constraints.maxY, clickY));
            
            movePokemonTo(targetX, targetY, 1500);
            
            // Increase activity after interaction
            activityLevel = Math.min(100, activityLevel + 5);
        }
    };

    // Initialize Pokemon position
    const initializePosition = () => {
        const constraints = getMovementConstraints();
        const startX = (constraints.minX + constraints.maxX) * 0.5;
        const startY = (constraints.minY + constraints.maxY) * 0.7; // Slightly lower in allowed area
        pokemon.style.left = startX + 'px';
        pokemon.style.top = startY + 'px';
        pokemon.style.position = 'absolute';
        
        // Initialize facing direction (start facing left - normal sprite direction)
        pokemon.classList.remove('flipped');
        currentDirection = 'left';
    };

    // Activity level decay over time
    const decayActivityLevel = () => {
        setInterval(() => {
            activityLevel = Math.max(20, activityLevel - 1);
        }, 30000); // Decay every 30 seconds
    };

    // Pause behavior when page is not visible
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            pokemon.classList.remove('dancing', 'excited', 'sleepy', 'jumping');
        } else if (document.visibilityState === 'visible') {
            scheduleNextActivity();
        }
    };

    // Initialize everything
    initializePosition();
    
    // Set up event listeners
    pokemon.addEventListener('click', handlePokemonClick);
    gameArea.addEventListener('click', handleAreaClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Start the behavior system
    setTimeout(() => {
        scheduleNextActivity();
        decayActivityLevel();
    }, 2000); // Give a 2 second delay before starting
    
    // Debug info (remove in production)
    console.log(`Enhanced behavior initialized for ${window.pokemonData?.name || 'Pokemon'}`);
    console.log(`Activity level: ${activityLevel.toFixed(1)}`);
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedPokemonBehavior);
} else {
    initializeEnhancedPokemonBehavior();
} 