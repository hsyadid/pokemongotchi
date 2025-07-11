/*Pokemon Name Input Handler*/

function initializePokemonNameHandler() {
    const nameDisplay = document.getElementById('pokemonNameDisplay');
    const nameInput = document.getElementById('pokemonNameInput');
    
    if (!nameDisplay || !nameInput) {
        console.error('Name display or input elements not found');
        return;
    }

    let currentName = '';
    let isEditMode = false;

    nameDisplay.addEventListener('click', function() {
        if (!isEditMode) {
            enterEditMode();
        }
    });

    nameInput.addEventListener('blur', function() {
        if (isEditMode) {
            saveAndExitEditMode();
        }
    });

    nameInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            saveAndExitEditMode();
        } else if (event.key === 'Escape') {
            cancelEdit();
        }
    });

    function enterEditMode() {
        isEditMode = true;
        nameInput.value = currentName;
        nameDisplay.style.display = 'none';
        nameInput.style.display = 'block';
        nameInput.focus();
        nameInput.select();
    }

    function saveAndExitEditMode() {
        const newName = nameInput.value.trim();
        
        if (newName && newName.length > 0) {
            currentName = newName;
            nameDisplay.textContent = currentName;
        } else {
            nameDisplay.textContent = 'Enter the name';
        }
        
        exitEditMode();
    }

    function cancelEdit() {
        nameInput.value = currentName;
        exitEditMode();
    }

    function exitEditMode() {
        isEditMode = false;
        nameInput.style.display = 'none';
        nameDisplay.style.display = 'block';
    }

    function getCurrentName() {
        return currentName;
    }

    function setName(name) {
        currentName = name;
        nameDisplay.textContent = currentName || 'Enter the name';
    }

    window.getPokemonName = getCurrentName;
    window.setPokemonName = setName;
} 