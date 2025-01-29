document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/api/recipes/categories-count") // קריאה ל-API שלנו ב-Express
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Error from API:", data.error);
                return;
            }

            const ctx = document.getElementById("recipesChart").getContext("2d");

            new Chart(ctx, {
                type: "pie", // ניתן לשנות ל "bar" כדי להציג גרף עמודות
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: "כמות מתכונים לפי קטגוריה",
                        data: data.counts,
                        backgroundColor: ["#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff"],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top"
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error loading data:", error));
});
