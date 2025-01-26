const favoriteRecipeList = document.querySelector('.favorite-recipe-list');

// פונקציה שמחזירה את רשימת המתכונים
function recipesByFavorite() {
    return [
        {
            name: "Spaghetti Bolognese",
            cookingTime: "30",
            calories: 400,
            servings: 4,
            rating: 4.5,
            description: "A classic Italian pasta dish with a rich and savory meat sauce.",
            imageUrl: "https://example.com/spaghetti-bolognese.jpg",
            categories: ["Italian", "Pasta", "Lunch", "Dinner"]
        },
        {
            name: "Chicken Caesar Salad",
            cookingTime: "20",
            calories: 300,
            servings: 2,
            rating: 4.2,
            description: "A fresh and crispy salad with grilled chicken, Caesar dressing, and croutons.",
            imageUrl: "https://example.com/chicken-caesar-salad.jpg",
            categories: ["Salad", "Healthy", "Lunch"]
        },
        {
            name: "Vegetable Stir Fry",
            cookingTime: "15",
            calories: 250,
            servings: 3,
            rating: 4.0,
            description: "A quick and easy stir fry loaded with colorful vegetables and a tangy sauce.",
            imageUrl: "https://example.com/vegetable-stir-fry.jpg",
            categories: ["Vegetarian", "Asian", "Quick Meals"]
        }
    ];
}

// פונקציה ליצירת כרטיס מתכון
function createRecipeCard(recipe) {
    return `
        <li class="recipe-item">
            <div class="card">
                <img class="card-image" src="${recipe.imageUrl}" alt="${recipe.name}">
                <div class="card-content">
                    <h3 class="card-title">${recipe.name}</h3>
                    <div class="card-info">
                        <div class="info-block">
                            <div class="value">${recipe.cookingTime}</div>
                            <div class="text">Minutes</div>
                        </div>
                        <div class="info-block">
                            <div class="value">${recipe.calories}</div>
                            <div class="text">Calories</div>
                        </div>
                        <div class="info-block">
                            <div class="value">${recipe.servings}</div>
                            <div class="text">Servings</div>
                        </div>
                    </div>
                    <div class="card-button">
                        <button>View Recipe</button>
                    </div>
                </div>
            </div>
        </li>
    `;
}

// פונקציה לעדכון רשימת המתכונים לפי קטגוריה
function updateFavoriteRecipes(selectedCategory = "all") {
    favoriteRecipeList.innerHTML = ''; // מנקה את הרשימה
    const recipes = recipesByFavorite();

    const filteredRecipes = recipes.filter(recipe => 
        selectedCategory === "all" || recipe.categories.includes(selectedCategory)
    );

    filteredRecipes.forEach(recipe => {
        favoriteRecipeList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });
}

// מאזין לטעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-button');

    // עדכון ראשוני של כל המתכונים
    updateFavoriteRecipes();

    // מאזין ללחיצה על כפתור קטגוריה
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            updateFavoriteRecipes(category);
        });
    });
});
