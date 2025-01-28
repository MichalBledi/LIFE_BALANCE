document.addEventListener("DOMContentLoaded", () => {
    initializeNutritionSearch();
});

// 📌 פונקציה לחיפוש נתונים תזונתיים
async function fetchNutritionData(foodName) {
    try {
        console.log("🔍 Searching for food:", foodName);
        const response = await fetch(`/api/nutrition/search?q=${encodeURIComponent(foodName)}`);

        if (!response.ok) {
            console.error("❌ Failed to fetch nutrition data:", response.statusText);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error fetching nutrition data:", error);
        return [];
    }
}

// 📌 פונקציה להצגת התוצאות על המסך
async function updateNutritionResults(foodName) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // מנקה את התוצאות הישנות

    const foodResults = await fetchNutritionData(foodName);
    if (foodResults.length === 0) {
        resultsContainer.innerHTML = "<p>No nutrition data found. Try a different search term.</p>";
        return;
    }

    foodResults.forEach(food => {
        resultsContainer.insertAdjacentHTML("beforeend", createNutritionCard(food));
    });

    resultsContainer.classList.remove("hidden"); // מציג את התוצאות
}

// 📌 יצירת כרטיסי מידע תזונתי
function createNutritionCard(food) {
    return `
        <div class="nutrition-card">
            <h3>${food.food_name}</h3>
            <div class="nutrient-row">
                <p><strong>Calories:</strong> ${food.caloric_value} kcal</p>
                <p><strong>Fat:</strong> ${food.fat} g</p>
                <p><strong>Saturated Fats:</strong> ${food.saturated_fats} g</p>
            </div>
            <div class="nutrient-row">
                <p><strong>Carbohydrates:</strong> ${food.carbohydrates} g</p>
                <p><strong>Sugars:</strong> ${food.sugars} g</p>
                <p><strong>Protein:</strong> ${food.protein} g</p>
            </div>
            <div class="nutrient-row">
                <p><strong>Dietary Fiber:</strong> ${food.dietary_fiber} g</p>
                <p><strong>Cholesterol:</strong> ${food.cholesterol} mg</p>
                <p><strong>Sodium:</strong> ${food.sodium} mg</p>
            </div>
            <div class="nutrient-row">
                <p><strong>Water:</strong> ${food.water} g</p>
                <p><strong>Calcium:</strong> ${food.calcium} mg</p>
                <p><strong>Iron:</strong> ${food.iron} mg</p>
            </div>
            <div class="nutrient-row">
                <p><strong>Potassium:</strong> ${food.potassium} mg</p>
                <p><strong>Vitamin C:</strong> ${food.vitamin_c} mg</p>
                <p><strong>Vitamin D:</strong> ${food.vitamin_d} IU</p>
            </div>
            <div class="nutrient-row">
                <p><strong>Nutrition Density:</strong> ${food.nutrition_density} %</p>
            </div>
        </div>
    `;
}

// 📌 פונקציה לאתחול שדה החיפוש
function initializeNutritionSearch() {
    const searchInput = document.getElementById("product-name");
    const searchButton = document.getElementById("calculate-btn");

    searchButton.addEventListener("click", () => {
        const foodName = searchInput.value.trim();
        if (foodName) {
            updateNutritionResults(foodName);
        }
    });

    // חיפוש בעת לחיצה על Enter
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            const foodName = searchInput.value.trim();
            if (foodName) {
                updateNutritionResults(foodName);
            }
        }
    });
}
