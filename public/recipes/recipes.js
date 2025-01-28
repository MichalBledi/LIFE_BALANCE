/*fetch('../navbar/sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-container').innerHTML = data;
    });
*/

fetch('top-section/top-section.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('top-section').innerHTML = data;
    });

const recipes = [
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
  },
  {
    name: "Chocolate Chip Cookies",
    cookingTime: "25",
    calories: 150,
    servings: 12,
    rating: 4.8,
    description: "Classic homemade cookies with gooey chocolate chips.",
    imageUrl: "https://example.com/chocolate-chip-cookies.jpg",
    categories: ["Dessert", "Snacks", "Baking"]
  },
  {
    name: "Avocado Toast",
    cookingTime: "10",
    calories: 200,
    servings: 1,
    rating: 4.7,
    description: "A simple and nutritious toast topped with creamy avocado and seasonings.",
    imageUrl: "https://example.com/avocado-toast.jpg",
    categories: ["Breakfast", "Healthy", "Vegetarian"]
  }
];

// בחירת אלמנטים לעדכון
const categoryTitle = document.querySelector('.category-title');
const recipeList = document.querySelector('.recipe-list');
const categoryButtons = document.querySelectorAll('.category-button');

const recipesByCategory = (category) => {
    return recipes.filter(recipe => recipe.categories.includes(category));
  };

// פונקציה לעדכון הכותרת והרשימה
function updateCategory(category) {
    // עדכון כותרת
    categoryTitle.textContent = category;

    // עדכון רשימת מתכונים
    recipeList.innerHTML = ''; // מנקה את הרשימה
    const recipes = recipesByCategory(category);
    recipes.forEach(recipe => {
        recipeList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });

    // עדכון כפתור פעיל
    categoryButtons.forEach(button => {
        if (button.dataset.category === category) {
            button.setAttribute('aria-selected', 'true');
        } else {
            button.setAttribute('aria-selected', 'false');
        }
    });
}

// הוספת מאזין אירועים לכפתורי הקטגוריות
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category; // מקבל את שם הקטגוריה
        updateCategory(category);
    });
});

function createRecipeCard(recipe) {
    return `
        <li class="recipe-item">
            <div class="card">
                <img class="card-image" src="${recipe.imageUrl}" alt="${recipe.name}">
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
                        <div class="info-block">
                            <div class="icon-value">
                                <div class="glyphicon glyphicon-fire"></div>
                                <div class="value">${recipe.calories}</div>
                            </div>
                            <div class="text">Calories</div>
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


/*
async function createRecipeCard(recipe) {
    const recipeCardTemplate = await fetch('recipeCardTemplate.html');
    let template = await recipeCardTemplate.text();
    template = template.replace('{{imageUrl}}', recipe.imageUrl)
                       .replace('{{name}}', recipe.name)
                       .replace('{{cookingTime}}', recipe.cookingTime)
                       .replace('{{calories}}', recipe.calories)
                       .replace('{{servings}}', recipe.servings);
    return template;
}
*/

// פונקציה לעדכון מתכונים מותאמים אישית (Just For You)
function updateCustomizedRecipes() {
    const customizedRecipesList = document.querySelector('.customized-recipes-section .recipe-list');
    const customizedRecipes = getCustomizedRecipes(); // פונקציה שמחזירה מתכונים מותאמים אישית
    customizedRecipesList.innerHTML = ''; // מנקה את הרשימה הקיימת
    customizedRecipes.forEach(recipe => {
        customizedRecipesList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });
}

// פונקציה לעדכון המתכונים הפופולריים (Most Popular This Week)
function updatePopularRecipes() {
    const popularRecipesList = document.querySelector('.popular-recipes-section .recipe-list');
    const popularRecipes = getPopularRecipes(); // פונקציה שמחזירה מתכונים פופולריים
    popularRecipesList.innerHTML = ''; // מנקה את הרשימה הקיימת
    popularRecipes.forEach(recipe => {
        popularRecipesList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });
}

// פונקציה שמחזירה מתכונים מותאמים אישית (דוגמה)
function getCustomizedRecipes() {
    // כאן ניתן להוסיף לוגיקה מותאמת אישית (כגון העדפות משתמש)
    // כרגע מוחזר מערך לדוגמה
    return recipes.filter(recipe => recipe.calories < 300); // מתכונים עם פחות מ-300 קלוריות
}

// פונקציה שמחזירה מתכונים פופולריים (דוגמה)
function getPopularRecipes() {
    // ניתן להוסיף לוגיקה מתקדמת (למשל, נתונים מבסיס נתונים)
    // כרגע מוחזר מערך לדוגמה
    return recipes.sort((a, b) => b.rating - a.rating).slice(0, 3); // שלושת המתכונים עם הדירוג הגבוה ביותר
}

// עדכון כל הקטגוריות ברגע שהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    updateCategory('Lunch'); // קטגוריית ברירת מחדל לקטגוריה הראשונה
    updateCustomizedRecipes(); // עדכון מתכונים מותאמים אישית
    updatePopularRecipes(); // עדכון מתכונים פופולריים
});
