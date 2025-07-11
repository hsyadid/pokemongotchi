/**
 * Pokemon Name Handler
 * Manages the display and input of Pokemon names
 * Allows users to click on "Enter the name" to set a custom name
 */

function initializePokemonNameHandler() {
    const nameDisplay = document.getElementById('pokemonNameDisplay');
    const nameInput = document.getElementById('pokemonNameInput');
    
    if (!nameDisplay || !nameInput) {
        console.error('Name display or input elements not found');
        return;
    }

    // Load saved name from localStorage if available
    const savedName = localStorage.getItem(`pokemon_${window.pokemonData.name}_customName`);
    if (savedName) {
        nameDisplay.textContent = savedName;
    }

    // Add click event to name display to show input
    nameDisplay.addEventListener('click', function() {
        showNameInput();
    });

    // Add input event handlers
    nameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            savePokemonName();
        }
    });

    nameInput.addEventListener('blur', function() {
        savePokemonName();
    });

    /**
     * Shows the name input field and hides the display
     */
    function showNameInput() {
        nameDisplay.style.display = 'none';
        nameInput.style.display = 'block';
        nameInput.value = nameDisplay.textContent === 'Enter the name' ? '' : nameDisplay.textContent;
        nameInput.focus();
        nameInput.select();
    }

    /**
     * Saves the entered name and updates the display
     */
    function savePokemonName() {
        const enteredName = nameInput.value.trim();
        
        // If empty, revert to original name or default text
        if (!enteredName) {
            nameDisplay.textContent = 'Enter the name';
        } else {
            nameDisplay.textContent = enteredName;
            // Save to localStorage for persistence
            localStorage.setItem(`pokemon_${window.pokemonData.name}_customName`, enteredName);
        }

        // Hide input and show display
        nameInput.style.display = 'none';
        nameDisplay.style.display = 'block';
    }

    /**
     * Gets the current Pokemon name (custom or default)
     * @returns {string} The current Pokemon name
     */
    function getCurrentPokemonName() {
        const displayText = nameDisplay.textContent;
        return displayText === 'Enter the name' ? window.pokemonData.name : displayText;
    }

    // Make functions available globally if needed
    window.getCurrentPokemonName = getCurrentPokemonName;
} 