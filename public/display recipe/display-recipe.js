document.addEventListener('DOMContentLoaded', () => {
    // קבלת ה-recipeId מה-URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipeId');

    // דוגמה לנתוני מתכון
    const recipes = [
        {
            id: 1,
            name: "Spaghetti Bolognese",
            cookingTime: "30",
            calories: "400",
            imageUrl: "https://via.placeholder.com/600x400",
            ingredients: ["Pasta", "Tomato Sauce", "Ground Beef", "Onion", "Garlic"],
            instructions: "Cook pasta. Prepare sauce. Mix together.",
            allergies: "Gluten",
            nutritionalValues: "400 Calories, 20g Protein, 10g Fat"
        },
        // מתכונים נוספים...
    ];

    // מציאת המתכון לפי ה-ID
    const recipe = recipes.find(r => r.id === parseInt(recipeId));

    if (recipe) {
        // עדכון התוכן בעמוד
        document.getElementById('recipe-name').textContent = recipe.name;
        document.getElementById('prep-time').textContent = recipe.cookingTime + " Minutes";
        document.getElementById('ingredients-list').innerHTML = recipe.ingredients
            .map(ingredient => `<li>${ingredient}</li>`)
            .join('');
        document.getElementById('instructions').textContent = recipe.instructions;
        document.getElementById('allergies').textContent = recipe.allergies;
        document.getElementById('nutritional-values').textContent = recipe.nutritionalValues;
        document.getElementById('recipe-img').src = recipe.imageUrl;
    } else {
        document.body.innerHTML = "<p>Recipe not found</p>";
    }
});
