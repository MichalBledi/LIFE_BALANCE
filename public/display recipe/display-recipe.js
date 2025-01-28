// Function to navigate back to the previous page
function goBack() {
    window.history.back();
}

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipeId');

    if (!recipeId) {
        document.querySelector('.container').innerHTML = '<p>Recipe not found.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/recipes/${recipeId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipe details');
        }

        const recipe = await response.json();

        // Display recipe details
        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('prep-time').textContent = `${recipe.minutes} minutes`;
        // Process and display instructions step-by-step
        const instructionsContainer = document.getElementById('instructions');
        instructionsContainer.innerHTML = ''; // Clear existing content

        const steps = recipe.steps.replace(/[\[\]']/g, '').split(',');
        const ol = document.createElement('ol'); // Ordered list
        steps.forEach(step => {
            const listItem = document.createElement('li');
            listItem.textContent = step.trim();
            ol.appendChild(listItem);
        });
        instructionsContainer.appendChild(ol);
        
        // Check the image or use a default image
        const recipeImage = document.getElementById('recipe-img');
        recipeImage.src = recipe.photo || '../recipes/default-photo.png';

        // Handle image load error
        recipeImage.onerror = () => {
            recipeImage.src = '../recipes/default-photo.png';
        };

        // Process ingredients
        const ingredients = recipe.ingredients
            .replace(/[\[\]']/g, '')
            .split(',');
        const ingredientsList = document.getElementById('ingredients-list');
        ingredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredient.trim();
            ingredientsList.appendChild(listItem);
        });

        // Process nutritional values
        const nutrition = recipe.nutrition.replace(/[\[\]]/g, '').split(',');
        const nutritionText = `
            Calories: ${nutrition[0]} kcal,
            Fat: ${nutrition[1]} g,
            Sugar: ${nutrition[2]} g,
            Protein: ${nutrition[3]} g
        `;
        document.getElementById('nutritional-values').textContent = nutritionText;

          // 🛑 Allergy Detection with Explanations
          const allergyKeywords = {
            dairy: { keywords: ['milk', 'cheese', 'butter', 'cream', 'yogurt'], reason: 'Contains dairy-based ingredients like' },
            gluten: { keywords: ['wheat', 'flour', 'barley', 'rye', 'bread', 'pasta'], reason: 'Contains gluten sources such as' },
            nuts: { keywords: ['almonds', 'walnuts', 'cashews', 'hazelnuts', 'pecans', 'pistachios'], reason: 'Contains tree nuts like' },
            peanuts: { keywords: ['peanuts', 'peanut butter', 'peanut oil'], reason: 'Contains peanuts or peanut-derived ingredients' },
            eggs: { keywords: ['eggs', 'egg whites', 'mayonnaise'], reason: 'Contains eggs or egg-based ingredients like' },
            fish: { keywords: ['fish', 'salmon', 'tuna', 'cod', 'sardines'], reason: 'Contains fish-based ingredients such as' },
            soy: { keywords: ['soy', 'soy sauce', 'tofu'], reason: 'Contains soy-based products like' },
            shellfish: { keywords: ['shrimp', 'crab', 'lobster'], reason: 'Contains shellfish such as' },
        };

        let detectedAllergens = [];

        for (const [allergen, data] of Object.entries(allergyKeywords)) {
            const matchingIngredients = ingredients.filter(ingredient =>
                data.keywords.some(keyword => ingredient.toLowerCase().includes(keyword))
            );

            if (matchingIngredients.length > 0) {
                detectedAllergens.push(`${data.reason} ${matchingIngredients.join(', ')}`);
            }
        }

        // Display detected allergens with reasons or show "No Allergens Detected"
        document.getElementById('allergies').innerHTML =
            detectedAllergens.length > 0
                ? `<strong>Potential Allergens:</strong><br> ${detectedAllergens.join('<br>')}`
                : 'No Common Allergens Detected';

    } catch (error) {
        console.error('Error fetching recipe details:', error);
        document.querySelector('.container').innerHTML = '<p>Failed to load recipe details.</p>';
    }
});
