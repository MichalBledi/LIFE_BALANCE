document.getElementById("calculate-btn").addEventListener("click", () => {
    const productName = document.getElementById("product-name").value;

    // נתוני דוגמה לחישוב
    const data = {
        apple: { calories: 52, proteins: 0.3, carbs: 14 },
        banana: { calories: 89, proteins: 1.1, carbs: 23 },
        rice: { calories: 130, proteins: 2.7, carbs: 28 }
    };

    const product = data[productName.toLowerCase()];

    if (product) {
        document.getElementById("calories").textContent = product.calories;
        document.getElementById("proteins").textContent = product.proteins;
        document.getElementById("carbs").textContent = product.carbs;
        document.getElementById("results").classList.remove("hidden");
    } else {
        alert("Product not found! Try 'apple', 'banana', or 'rice'.");
        document.getElementById("results").classList.add("hidden");
    }
});

// פונקציה לחזרה לעמוד הקודם
function goBack() {
    window.history.back(); // חזרה לעמוד הקודם בהיסטוריית הדפדפן
}