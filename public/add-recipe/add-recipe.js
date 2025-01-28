let ingredients = []; // הגדרת משתנה גלובלי לרשימת הרכיבים

// Function to handle ingredient search

function searchIngredient(inputElement) {
    const query = inputElement.value.trim(); // Get the value of the input field

    // Check if query is not empty before making the request
    if (query.length > 0) {
        fetch(`/api/ingredients/search-ingredient?query=${query}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Log the response to see what you're getting
                const resultsContainer = inputElement.closest('.input-group').querySelector('.results-container');
                resultsContainer.innerHTML = ''; // Clear previous results

                // Check if data is an array
                if (Array.isArray(data)) {
                    data.forEach(ingredient => {
                        const resultItem = document.createElement('div');
                        resultItem.classList.add('result-item');
                        resultItem.textContent = ingredient.food_name; // Use 'food_name' returned by the API
                        resultItem.onclick = () => selectIngredient(inputElement, ingredient.food_name);
                        resultsContainer.appendChild(resultItem);
                    });
                } else {
                    console.error('Data is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching ingredients:', error));
    }
}

// Function to handle ingredient selection
function selectIngredient(inputElement, ingredientName) {
    // Create a new div with the selected ingredient
    const selectedIngredientDiv = document.createElement('div');
    selectedIngredientDiv.classList.add('selected-ingredient');
    selectedIngredientDiv.textContent = ingredientName;

    // Replace the input field with the selected ingredient
    const inputGroup = inputElement.closest('.input-group');
    inputGroup.innerHTML = ''; // Clear the input field
    inputGroup.appendChild(selectedIngredientDiv);

    // Add a new search input field below the selected ingredient
    addIngredientInput();
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

// Function to collect all preparation steps
function getRecipeSteps() {
    const steps = [];
    document.querySelectorAll('.direction-input').forEach(input => {
        if (input.value.trim() !== '') {
            steps.push(input.value.trim());
        }
    });

    // If no steps were provided, use a default step
    return steps.length > 0 ? steps : ["Wash the apple"];
}


// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();

    // ברירת מחדל
    const defaultName = "Default Recipe Name";
    const defaultIngredient = ["Apple"];
    const defaultSteps = getRecipeSteps();
    const defaultCategory = "Breakfast";
    const defaultTime = 40;
    const defaultNutrition = {
        calories: 50,
        fat: "50 g",
        sugar: "50 g",
        sodium: "50 mg",
        protein: "50 g",
        saturatedFat: "50 g",
        carbohydrates: "50 g"
    };

    // איסוף נתונים
    const recipeName = document.getElementById("recipeName")?.value || defaultName;
    const recipeTime = document.getElementById("recipeTime")?.value || defaultTime;
    const recipeTags = document.getElementById("recipeTags")?.value || defaultCategory;
    const recipeIngredients = ingredients.length ? ingredients : defaultIngredient;

    formData.append("name", recipeName);
    formData.append("minutes", recipeTime);
    formData.append("tags", recipeTags);
    formData.append("steps", JSON.stringify(defaultSteps));
    formData.append("ingredients", JSON.stringify(recipeIngredients));
    formData.append("nutrition", JSON.stringify(defaultNutrition));

    fetch('/api/recipes/add', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Recipe saved:", data);
        if (data.success) {
            alert("Recipe added successfully!");
            window.location.href = "../user_info/user-info.html"; 
        } else {
            alert("Error saving recipe: " + data.error);
        }
    })
    .catch(error => console.error("❌ Error saving recipe:", error));
}

// הוספת מאזין ללחיצה על הכפתור
document.querySelector('.done-btn').addEventListener('click', handleSubmit);


// Add event listener for the form submission
const submitButton = document.querySelector('.done-btn');
submitButton.addEventListener('click', handleSubmit);

async function submitRecipe(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById('recipeForm'));

    try {
        const response = await fetch('submit-recipe.php', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('Recipe added successfully!');
            window.location.href = '../my recipes/my-recipes.html';
        } else {
            alert('Error: ${result.message}');
        }
    } catch (error) {
        alert('An error occurred: ${error.message}');
    }
}