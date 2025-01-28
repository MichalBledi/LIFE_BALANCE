document.addEventListener("DOMContentLoaded", function () {
    fetchUserCount();
    fetchRecipeCount();
    fetchIngredientsCount();
    fetchSuccessRate();
    fetchAndRenderBMIData();
    // Load the heatmap HTML dynamically
    fetch("../heat_map/heat_map.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("heatmap-container").innerHTML = html;
            loadHeatmapScript(); // Call function to initialize heatmap
        })
        .catch(err => console.error("Failed to load heatmap:", err));
    
});

async function fetchUserCount() {
    console.log("Fetching user count..."); // Debugging
    try {
        const response = await fetch('/api/count');
        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("User count:", data);

        const userCountElement = document.getElementById('user-count');
        if (!userCountElement) {
            console.error("Error: #user-count element not found in DOM");
            return;
        }

        userCountElement.textContent = data.count;
    } catch (error) {
        console.error('Failed to fetch user count:', error);
        document.getElementById('user-count').textContent = 'Error';
    }
}

async function fetchRecipeCount() {
    console.log("Fetching recipe count...");
    try {
        console.log("here...");
        const response = await fetch('/api/recipes/count');
        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Recipe count:", data);

        const recipeCountElement = document.getElementById('recipe-count');
        if (!recipeCountElement) {
            console.error("Error: #recipe-count element not found in DOM");
            return;
        }

        recipeCountElement.textContent = data.count;
    } catch (error) {
        console.error('Failed to fetch recipe count:', error);
        document.getElementById('recipe-count').textContent = 'Error';
    }
}

function loadHeatmapScript() {
    // Load the heatmap script after inserting the HTML
    const script = document.createElement("script");
    script.src = "../heat_map/heat_map.js";
    document.body.appendChild(script);
}

async function fetchIngredientsCount() {
    console.log("Fetching ingredient count...");
    try {
        const response = await fetch('/api/ingredients/count');
        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Ingredient count:", data);

        const ingredientsCountElement = document.getElementById('ingredients-count');
        if (!ingredientsCountElement) {
            console.error("Error: #ingredients-count element not found in DOM");
            return;
        }

        ingredientsCountElement.textContent = data.count;
    } catch (error) {
        console.error('Failed to fetch ingredient count:', error);
        document.getElementById('ingredients-count').textContent = 'Error';
    }
}

async function fetchSuccessRate() {
    console.log("Fetching success rate...");
    try {
        const response = await fetch('/api/success-rate');
        console.log("Response received:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Success Rate:", data);

        const successRateElement = document.getElementById('success-rate');
        if (!successRateElement) {
            console.error("Error: #success-rate element not found in DOM");
            return;
        }

        successRateElement.textContent = `${data.successRate}%`;
    } catch (error) {
        console.error('Failed to fetch success rate:', error);
        document.getElementById('success-rate').textContent = 'Error';
    }
}

async function fetchAndRenderBMIData() {
    try {
        const response = await fetch('/api/bmi/bmi-data'); 
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Transform data for Plotly
        const groupedData = {};
        data.forEach(row => {
            const key = `${row.country}-${row.gender}`;
            if (!groupedData[key]) {
                groupedData[key] = { x: [], y: [], name: `${row.country} (${row.gender})` };
            }
            groupedData[key].x.push(row.year);
            groupedData[key].y.push(row.avg_bmi);
        });

        // Prepare traces for Plotly
        const traces = Object.values(groupedData);

        // Render the chart
        Plotly.newPlot('bmi-chart-container', traces, {
            title: 'Average BMI Trends by Country and Gender (1996-2016)',
            xaxis: { title: 'Year', dtick: 2 },
            yaxis: { title: 'Average BMI' },
            margin: { t: 50, l: 50, r: 50, b: 50 }
        }, 
        {
            displayModeBar: false // This hides the toolbar
        });
        
    } catch (error) {
        console.error('Failed to fetch or render BMI data:', error);
    }
}



