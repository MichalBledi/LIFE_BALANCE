document.addEventListener('DOMContentLoaded', () => {

    const ingredientSearch = document.getElementById("ingredientSearch");
    const ingredientResults = document.getElementById("ingredientResults");
    const selectedIngredientsList = document.getElementById("selectedIngredients");
    let selectedIngredients = [];

    // 📌 חיפוש חכם של מצרכים
    ingredientSearch.addEventListener("input", async () => {
        const query = ingredientSearch.value.trim();
        if (query.length < 2) {
            ingredientResults.innerHTML = "";
            return;
        }

        console.log("🔍 Searching for:", query); // בדיקה

        try {
            const response = await fetch(`/api/ingredients/search?q=${query}`);
            console.log("📡 Server response status:", response.status);

            const ingredients = await response.json();
            console.log("📦 Received ingredients:", ingredients);

            ingredientResults.innerHTML = ""; // ניקוי תוצאות קודמות

            if (ingredients.length === 0) {
                const li = document.createElement("li");
                li.textContent = "No results found";
                li.classList.add("no-results");
                ingredientResults.appendChild(li);
                return;
            }

            ingredients.forEach(ingredient => {
                const li = document.createElement("li");
                li.textContent = ingredient.food_name;
                li.dataset.id = ingredient.id;
                li.classList.add("autocomplete-item");
                li.addEventListener("click", () => {
                    addIngredient(ingredient);
                });
                ingredientResults.appendChild(li);
            });
        } catch (error) {
            console.error("❌ Error fetching ingredients:", error);
        }
    });

    function addIngredient(ingredient) {
        if (!selectedIngredients.some(i => i.food_name === ingredient.food_name)) {
            selectedIngredients.push(ingredient);
            updateIngredientList();
        }
        ingredientSearch.value = "";
        ingredientResults.innerHTML = ""; // מחיקת תוצאות לאחר בחירה
    }

    function updateIngredientList() {
        selectedIngredientsList.innerHTML = "";
        selectedIngredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient.food_name;
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "❌";
            removeBtn.addEventListener("click", () => {
                selectedIngredients = selectedIngredients.filter(i => i.food_name !== ingredient.food_name);
                updateIngredientList();
            });
            li.appendChild(removeBtn);
            selectedIngredientsList.appendChild(li);
        });
    }

    function toggleCategoryButton(event) {
        const button = event.target;
    
        // הסרת active מכל הכפתורים
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
        });
    
        // הוספת active לכפתור שנלחץ
        button.classList.add('active');
    }
    

    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', toggleCategoryButton);
    });


    // הגדרת מאזין לטופס שליחת מתכון
    document.getElementById('recipeForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // איסוף נתונים מהטופס
        const recipeName = document.getElementById('recipeName').value.trim();
        const ingredients = Array.from(document.getElementsByName('ingredients')).map(input => input.value.trim()).filter(value => value !== '');
        const directions = Array.from(document.getElementsByName('directions')).map(input => input.value.trim()).filter(value => value !== '');
        const cookingTime = document.getElementById('cookingTime').value.trim();
        const nutrition = document.getElementById('nutrition').value.trim();
        const tags = document.getElementById('tags').value.trim();
        const photo = document.getElementById('previewImage').src;

        try {
            // שליחת הנתונים לשרת
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: recipeName,
                    ingredients,
                    directions,
                    cookingTime,
                    nutrition,
                    tags,
                    photo
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Recipe submitted successfully!');
                window.location.href = '../my recipes/my-recipes.html'; // הפניה לעמוד המתכונים שלי
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error submitting recipe:', error);
            alert('An error occurred. Please try again.');
        }
    });
});

// פונקציה להצגת התמונה שנבחרה
document.getElementById('addPicture').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };

        reader.readAsDataURL(file);
    }
});

// פונקציה להוספת שדה חדש עבור מרכיב
function addIngredientInput() {
    const inputsWrapper = document.querySelector('.inputs-wrapper');
    const allAddMoreButtons = inputsWrapper.querySelectorAll('.add-more');
    allAddMoreButtons.forEach(button => button.style.display = 'none');

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'ingredients';
    input.placeholder = 'Enter ingredient';
    input.className = 'ingredient-input';

    const addMoreButton = document.createElement('span');
    addMoreButton.className = 'add-more';
    addMoreButton.textContent = '+';
    addMoreButton.onclick = addIngredientInput;

    inputGroup.appendChild(input);
    inputGroup.appendChild(addMoreButton);

    inputsWrapper.appendChild(inputGroup);
}

// פונקציה להוספת שדה חדש עבור שלבים
function addDirectionInput() {
    const directionsWrapper = document.querySelector('#directionsContainer');
    const allAddMoreButtons = directionsWrapper.querySelectorAll('.add-more');
    allAddMoreButtons.forEach(button => button.style.display = 'none');

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'directions';
    input.placeholder = 'Enter preparation step';
    input.className = 'direction-input';

    const addMoreButton = document.createElement('span');
    addMoreButton.className = 'add-more';
    addMoreButton.textContent = '+';
    addMoreButton.onclick = addDirectionInput;

    inputGroup.appendChild(input);
    inputGroup.appendChild(addMoreButton);

    directionsWrapper.appendChild(inputGroup);
}


