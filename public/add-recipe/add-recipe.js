// Function to handle ingredient search
function searchIngredient(inputElement) {
    const query = inputElement.value.trim();

    if (query.length > 0) {
        fetch(`/api/ingredients/search-ingredient?query=${query}`)
            .then(response => response.json())
            .then(data => {
                const resultsContainer = inputElement.closest('.input-group').querySelector('.results-container');
                resultsContainer.innerHTML = ''; // Clear previous results

                // Show the first 5 matching ingredients
                data.forEach(ingredient => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');
                    resultItem.textContent = ingredient.name; // Assuming ingredient has a 'name' property
                    resultItem.onclick = () => selectIngredient(inputElement, ingredient.name);
                    resultsContainer.appendChild(resultItem);
                });
            })
            .catch(error => console.error('Error fetching ingredients:', error));
    }
}

// Function to handle ingredient selection
function selectIngredient(inputElement, ingredientName) {
    inputElement.value = ingredientName; // Set the ingredient name in the input field
    inputElement.closest('.input-group').querySelector('.results-container').innerHTML = ''; // Clear results
}

// Add new ingredient input field
function addIngredientInput() {
    const ingredientsContainer = document.getElementById('ingredientsContainer');
    const newInputGroup = document.createElement('div');
    newInputGroup.classList.add('input-group');
    newInputGroup.innerHTML = `
        <input type="text" name="ingredients" placeholder="Search for ingredient.." class="ingredient-input" oninput="searchIngredient(this)">
        <button type="button" class="search-button">Search</button>
        <span class="add-more" onclick="addIngredientInput()">+</span>
        <div class="results-container"></div>
    `;
    ingredientsContainer.appendChild(newInputGroup);
}

// Add new direction input field
function addDirectionInput() {
    const directionsContainer = document.getElementById('directionsContainer');
    const newInputGroup = document.createElement('div');
    newInputGroup.classList.add('input-group');
    newInputGroup.innerHTML = `
        <input type="text" name="directions[]" placeholder="Enter preparation step" class="direction-input">
        <span class="add-more" onclick="addDirectionInput()">+</span>
    `;
    directionsContainer.appendChild(newInputGroup);
}

// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const form = document.getElementById('recipeForm');
    const formData = new FormData(form);

    // Gather the ingredients and directions arrays manually
    const ingredients = [];
    const directions = [];
    document.querySelectorAll('.ingredient-input').forEach(input => {
        if (input.value.trim() !== '') {
            ingredients.push(input.value.trim());
        }
    });
    document.querySelectorAll('.direction-input').forEach(input => {
        if (input.value.trim() !== '') {
            directions.push(input.value.trim());
        }
    });

    // Add custom fields to formData
    formData.append('ingredients', JSON.stringify(ingredients));
    formData.append('directions', JSON.stringify(directions));

    // Handle image upload (optional)
    const pictureInput = document.getElementById('addPicture');
    if (pictureInput.files.length > 0) {
        formData.append('picture', pictureInput.files[0]);
    }

    // Send the data to the server using Fetch API
    fetch('/api/recipes', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Recipe added successfully!');
            form.reset(); // Reset the form after successful submission
        } else {
            alert('Error adding recipe.');
        }
    })
    .catch(error => {
        console.error('Error submitting the form:', error);
        alert('Error submitting the recipe.');
    });
}

// Add event listener for the form submission
const submitButton = document.querySelector('.done-btn');
submitButton.addEventListener('click', handleSubmit);
