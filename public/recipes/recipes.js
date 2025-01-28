fetch('top-section/top-section.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('top-section').innerHTML = data;
        console.log('Top section loaded.');

        // Initialize search functionality after top-section is loaded
        initializeSearch();

        // Load the filter bar after top-section is loaded
        return fetch('top-section/filterbar.html');
    })
    .then(response => response.text())
    .then(data => {
        const filterbarContainer = document.getElementById('filterbar-container');
        if (filterbarContainer) {
            filterbarContainer.innerHTML = data;
            console.log('Filter bar loaded successfully.');

            // Initialize the filter functionality after filterbar is loaded
            initializeFilters();
        } else {
            console.error('Filter bar container not found.');
        }
    })
    .catch(error => {
        console.error('Error loading top-section or filterbar:', error);
    });

const categoryTitle = document.querySelector('.category-title');
const recipeList = document.querySelector('.recipe-list');
const categoryButtons = document.querySelectorAll('.category-button');
const popularRecipesList = document.querySelector('.popular-recipes-section .recipe-list');


// Function to initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');

    async function fetchSearchResults(searchTerm) {
        const response = await fetch(`/api/recipes/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            console.error('Failed to fetch search results:', response.statusText);
            return [];
        }
        return await response.json();
    }

    async function updateSearchResults(searchTerm) {
        categoryTitle.textContent = `Search Results for "${searchTerm}"`; // Update the title
        recipeList.innerHTML = ''; // Clear the current recipes

        const searchResults = await fetchSearchResults(searchTerm);
        if (searchResults.length === 0) {
            recipeList.innerHTML = '<p>No recipes found. Try a different search term.</p>';
            return;
        }

        searchResults.forEach(recipe => {
            recipeList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
        });
    }

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            updateSearchResults(searchTerm);
        }
    });

    // Optional: Trigger search on Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                updateSearchResults(searchTerm);
            }
        }
    });
}

// Function to update the recipe list with filtered recipes
function updateFilteredRecipes(recipes) {
    console.log('Updating filtered recipes on the page:', recipes);
    const recipeList = document.querySelector('.recipe-list');
    recipeList.innerHTML = ''; // Clear existing recipes
    if (recipes.length === 0) {
        recipeList.innerHTML = '<p>No recipes match your filters.</p>';
        return;
    }

    recipes.forEach(recipe => {
        recipeList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });
    console.log('Updated recipes list with filtered results.');
}

// Function to initialize filter functionality
function initializeFilters() {
    const applyFiltersButton = document.querySelector('.apply-filters-btn');
    const clearFiltersButton = document.querySelector('.clear-filters-btn');
    const filterInputs = document.querySelectorAll('.filter-content input[type="checkbox"]');
    const prepTimeInput = document.querySelector('#prep-time-input');
    const caloriesInput = document.querySelector('#calories-input');

    async function applyFilters() {
        const selectedAllergies = Array.from(filterInputs)
            .filter(input => input.checked)
            .map(input => input.value);

        const maxPrepTime = prepTimeInput ? parseInt(prepTimeInput.value, 10) : null;
        const maxCalories = caloriesInput ? parseInt(caloriesInput.value, 10) : null;
        
         // Build a title based on filters
    let title = 'Filtered Recipes';
    if (selectedAllergies.length > 0) {
        title += ` (Allergies: ${selectedAllergies.join(', ')})`;
    }
    if (maxPrepTime) {
        title += ` (Prep Time: <= ${maxPrepTime} mins)`;
    }
    if (maxCalories) {
        title += ` (Calories: <= ${maxCalories})`;
    }
    categoryTitle.textContent = title; // Update the category title dynamically

        const response = await fetch('/api/recipes/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ allergies: selectedAllergies, maxPrepTime, maxCalories }),
        });

        if (!response.ok) {
            console.error('Failed to fetch filtered recipes:', response.statusText);
            return;
        }

        const filteredRecipes = await response.json();
        updateFilteredRecipes(filteredRecipes);
    }

    function updateFilteredRecipes(recipes) {
        const recipeList = document.querySelector('.recipe-list');
        recipeList.innerHTML = ''; // Clear existing recipes
        if (recipes.length === 0) {
            recipeList.innerHTML = '<p>No recipes match your filters.</p>';
            return;
        }

        recipes.forEach(recipe => {
            recipeList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
        });
    }

    applyFiltersButton.addEventListener('click', applyFilters);

    clearFiltersButton.addEventListener('click', () => {
        filterInputs.forEach(input => (input.checked = false));
        if (prepTimeInput) prepTimeInput.value = '';
        if (caloriesInput) caloriesInput.value = '';
        updateCategory('lunch');
    });
}


async function fetchPopularRecipes() {
    const response = await fetch('/api/recipes/popular');
    if (!response.ok) {
        console.error('Failed to fetch popular recipes:', response.statusText);
        return [];
    }
    return await response.json();
}

async function updatePopularRecipes() {
    popularRecipesList.innerHTML = ''; // Clear the list

    const popularRecipes = await fetchPopularRecipes();
    popularRecipes.forEach(recipe => {
        popularRecipesList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });
}

async function fetchRecipes(category = '') {
    const response = await fetch(`/api/recipes?category=${category}`);
    if (!response.ok) {
        console.error('Failed to fetch recipes:', response.statusText);
        return [];
    }
    return await response.json();
}

async function updateCategory(category) {
    categoryTitle.textContent = category;

    recipeList.innerHTML = '';
    const recipes = await fetchRecipes(category);

    recipes.forEach(recipe => {
        recipeList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });

    categoryButtons.forEach(button => {
        if (button.dataset.category === category) {
            button.setAttribute('aria-selected', 'true');
        } else {
            button.setAttribute('aria-selected', 'false');
        }
    });
}

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        updateCategory(category);
    });
});

function createRecipeCard(recipe) {
    console.log('Creating recipe card for:', recipe); // Debugging

    return `
        <li class="recipe-item">
            <div class="card">
                <img class="card-image" src="${recipe.photo}" alt="${recipe.name}" 
                    onerror="this.onerror=null; this.src='./default-photo.png';">
                <div class="card-content">
                    <h3 class="card-title">${recipe.name}</h3>
                    <div class="row-wrapper"></div>
                    <div class="card-info">
                        <div class="info-block">
                            <div class="icon-value">
                                <div class="glyphicon glyphicon-time"></div>
                                <div class="value">${recipe.cookingTime}</div>
                            </div>
                            <div class="text">Minutes</div>
                        </div>
                    </div>
                    <div class="card-button">
                        <a href="../display recipe/display-recipe.html?recipeId=${recipe.id}" class="view-recipe-button">View Recipe</a>
                    </div>
                </div>
            </div>
        </li>
    `;
}




async function applyFilters() {
    console.log('Apply Filters button clicked');

    const selectedAllergies = Array.from(document.querySelectorAll('.filter-content input[type="checkbox"]'))
        .filter(input => input.checked)
        .map(input => input.value);

    const maxPrepTime = document.querySelector('#prep-time-input') ? parseInt(document.querySelector('#prep-time-input').value, 10) : null;
    const maxCalories = document.querySelector('#calories-input') ? parseInt(document.querySelector('#calories-input').value, 10) : null;

    console.log('Selected Allergies:', selectedAllergies);
    console.log('Max Preparation Time:', maxPrepTime);
    console.log('Max Calories:', maxCalories);

    try {
        const response = await fetch('/api/recipes/filter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ allergies: selectedAllergies, maxPrepTime, maxCalories }),
        });

        if (!response.ok) {
            console.error('Failed to fetch filtered recipes:', response.statusText);
            return;
        }

        const filteredRecipes = await response.json();
        console.log('Filtered Recipes:', filteredRecipes);
        updateFilteredRecipes(filteredRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCategory('Lunch'); 
    updatePopularRecipes();
});
