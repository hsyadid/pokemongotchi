/* Enhanced Pokemon Interactive Behavior System*/

function initializeEnhancedPokemonBehavior() {
    const pokemon = document.getElementById('pokemonSprite');
    const gameArea = document.getElementById('gameArea');
    
    if (!pokemon || !gameArea) return;

    let isMoving = false;
    let currentDirection = 'right';
    let activityLevel = Math.random() * 100;
    let lastActivity = Date.now();
    let moodCycle = 0;

    const getGameAreaBounds = () => {
        const rect = gameArea.getBoundingClientRect();
        const pokemonRect = pokemon.getBoundingClientRect();
        return {
            width: gameArea.offsetWidth - pokemonRect.width,
            height: gameArea.offsetHeight - pokemonRect.height
        };
    };

    const getMovementConstraints = () => {
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
        
        if (pokemonType === 'sky' || pokemonType === 'underwater') {
            return {
                minX: 0,
                maxX: bounds.width,
                minY: 0,
                maxY: bounds.height
            };
        }
        
        return {
            minX: 0,
            maxX: bounds.width,
            minY: bounds.height * 0.75,
            maxY: bounds.height * 0.95
        };
    };

    const movementPatterns = {
        explore: () => {
            const constraints = getMovementConstraints();
            const targetX = constraints.minX + Math.random() * (constraints.maxX - constraints.minX);
            const targetY = constraints.minY + Math.random() * (constraints.maxY - constraints.minY);
            movePokemonTo(targetX, targetY, 2000 + Math.random() * 3000);
        },
        
        patrol: () => {
            const constraints = getMovementConstraints();
            const currentX = parseInt(pokemon.style.left) || 0;
            const targetX = currentX < (constraints.maxX / 2) ? constraints.maxX * 0.8 : constraints.maxX * 0.2;
            const targetY = constraints.minY + Math.random() * (constraints.maxY - constraints.minY);
            movePokemonTo(targetX, targetY, 3000 + Math.random() * 2000);
        },
        
        circle: () => {
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

    const movePokemonTo = (targetX, targetY, duration) => {
        if (isMoving) return;
        
        isMoving = true;
        const currentX = parseInt(pokemon.style.left) || 0;
        const currentY = parseInt(pokemon.style.top) || 0;
        
        if (targetX > currentX) {
            pokemon.classList.add('flipped');
            currentDirection = 'right';
        } else if (targetX < currentX) {
            pokemon.classList.remove('flipped');
            currentDirection = 'left';
        }
        
        pokemon.classList.add('moving');
        pokemon.style.transition = `all ${duration}ms ease-in-out`;
        pokemon.style.left = targetX + 'px';
        pokemon.style.top = targetY + 'px';
        
        setTimeout(() => {
            isMoving = false;
            pokemon.classList.remove('moving');
            pokemon.style.transition = '';
            scheduleNextActivity();
        }, duration);
    };

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
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    pokemon.classList.add('jumping');
                    setTimeout(() => pokemon.classList.remove('jumping'), 600);
                }, i * 800);
            }
        }
    };

    const getActivityFrequency = () => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        const baseFrequency = 3000 + (100 - activityLevel) * 100;
        
        moodCycle = (moodCycle + 1) % 100;
        const moodMultiplier = 0.5 + Math.sin(moodCycle * 0.1) * 0.5;
        
        return baseFrequency * moodMultiplier * (0.5 + Math.random());
    };

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

    const performRandomActivity = () => {
        lastActivity = Date.now();
        
        const shouldMove = Math.random() * 100 < activityLevel;
        
        if (shouldMove) {
            const patterns = Object.keys(movementPatterns);
            const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
            movementPatterns[randomPattern]();
        } else {
            const moods = Object.keys(moodAnimations);
            const randomMood = moods[Math.floor(Math.random() * moods.length)];
            moodAnimations[randomMood]();
            scheduleNextActivity();
        }
    };

    const handlePokemonClick = (event) => {
        event.stopPropagation();
        activityLevel = Math.min(100, activityLevel + 10);
        
        if (Math.random() > 0.5) {
            moodAnimations.happy();
        } else {
            pokemon.classList.add('jumping');
            setTimeout(() => pokemon.classList.remove('jumping'), 600);
        }
        
        if (Math.random() > 0.7) {
            setTimeout(() => {
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

    const handleAreaClick = (event) => {
        if (event.target === gameArea) {
            const rect = gameArea.getBoundingClientRect();
            const clickX = event.clientX - rect.left - pokemon.offsetWidth / 2;
            const clickY = event.clientY - rect.top - pokemon.offsetHeight / 2;
            
            const constraints = getMovementConstraints();
            const targetX = Math.max(constraints.minX, Math.min(constraints.maxX, clickX));
            const targetY = Math.max(constraints.minY, Math.min(constraints.maxY, clickY));
            
            movePokemonTo(targetX, targetY, 1500);
            activityLevel = Math.min(100, activityLevel + 5);
        }
    };

    const initializePosition = () => {
        const constraints = getMovementConstraints();
        const startX = (constraints.minX + constraints.maxX) * 0.5;
        const startY = (constraints.minY + constraints.maxY) * 0.7;
        pokemon.style.left = startX + 'px';
        pokemon.style.top = startY + 'px';
        pokemon.style.position = 'absolute';
        
        pokemon.classList.remove('flipped');
        currentDirection = 'left';
    };

    const decayActivityLevel = () => {
        setInterval(() => {
            activityLevel = Math.max(20, activityLevel - 1);
        }, 30000);
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            pokemon.classList.remove('dancing', 'excited', 'sleepy', 'jumping');
        } else if (document.visibilityState === 'visible') {
            scheduleNextActivity();
        }
    };

    initializePosition();
    pokemon.addEventListener('click', handlePokemonClick);
    gameArea.addEventListener('click', handleAreaClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    setTimeout(() => {
        scheduleNextActivity();
        decayActivityLevel();
    }, 2000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedPokemonBehavior);
} else {
    initializeEnhancedPokemonBehavior();
} 