// מאזין לאירוע לחיצה על כפתור "Calculate"
document.getElementById("calculate-btn").addEventListener("click", () => {
    const productName = document.getElementById("product-name").value.trim().toLowerCase(); // קלט המשתמש

    // נתוני דוגמה
    const data = {
        apple: {
            caloric_value: 52,
            fat: 0.2,
            saturated_fats: 0.0,
            carbohydrates: 14,
            sugars: 10,
            protein: 0.3,
            dietary_fiber: 2.4,
            cholesterol: 0,
            sodium: 1,
            water: 85.6,
            calcium: 6,
            iron: 0.1,
            potassium: 107,
            vitamin_c: 4.6,
            vitamin_d: 0,
            nutrition_density: 35
        },
        banana: {
            caloric_value: 89,
            fat: 0.3,
            saturated_fats: 0.1,
            carbohydrates: 23,
            sugars: 12,
            protein: 1.1,
            dietary_fiber: 2.6,
            cholesterol: 0,
            sodium: 1,
            water: 74.9,
            calcium: 5,
            iron: 0.3,
            potassium: 358,
            vitamin_c: 8.7,
            vitamin_d: 0,
            nutrition_density: 45
        }
    };

    // חיפוש המוצר בנתונים
    const product = data[productName];

    // אם נמצא המוצר
    if (product) {
        Object.keys(product).forEach((key) => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = product[key]; // עדכון הערכים בעמוד
            }
        });
        document.getElementById("results").classList.remove("hidden"); // הצגת התוצאות
    } else {
        alert("Product not found! Try 'apple' or 'banana'."); // הודעת שגיאה
        document.getElementById("results").classList.add("hidden"); // הסתרת התוצאות
    }
});

// פונקציה לחזרה לעמוד הקודם
function goBack() {
    window.history.back(); // חזרה לעמוד הקודם בהיסטוריית הדפדפן
}
