document.addEventListener("DOMContentLoaded", async () => {
    const username = sessionStorage.getItem("username");

    if (!username) {
        alert("No username found. Redirecting to login.");
        window.location.href = "../login/login.html";
        return;
    }

    console.log("Fetching user details for:", username);

    try {
        // Fetch user data from the server
        const response = await fetch(`/api/users/${username}`);
        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        const user = await response.json();

        if (!user || Object.keys(user).length === 0) {
            throw new Error("User data is empty.");
        }
        // Populate "My Details" section
        document.querySelector(".user-greeting").textContent = `Welcome, ${user.username}!`;
        document.getElementById("user-name").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("age").textContent = calculateAge(user.date_of_birth);

        // Populate user details
        document.getElementById("height-input").value = user.height;
        document.getElementById("weight-input").value = user.weight;
        document.getElementById("activity-display").textContent = user.activity_index;
        document.getElementById("goal-display").textContent = formatPurpose(user.purpose);

        // Calculate & display BMI
        updateBMIDisplay(user.weight, user.height);

        // Fetch and display BMI history
        await fetchBMIHistory(user.id);

        // Attach event listener to save button
        document.getElementById("save-changes-btn").addEventListener("click", () => saveUserChanges(user.id));

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error loading personal information. Please try again later.");
    }
});

// Function to update the BMI display in real-time
function updateBMIDisplay(weight, height) {
    const bmi = calculateBMI(weight, height);
    document.getElementById("bmi-display").textContent = bmi.toFixed(2);
}

// Function to handle weight/height update
async function saveUserChanges(userId) {
    const newHeight = parseFloat(document.getElementById("height-input").value);
    const newWeight = parseFloat(document.getElementById("weight-input").value);

    if (isNaN(newHeight) || isNaN(newWeight) || newHeight < 50 || newHeight > 250 || newWeight < 20 || newWeight > 300) {
        alert("Please enter valid height and weight values.");
        return;
    }

    try {
        const response = await fetch(`/api/users/update/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ height: newHeight, weight: newWeight })
        });

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        alert("Changes saved successfully!");
        updateBMIDisplay(newWeight, newHeight);
        await fetchBMIHistory(userId); // Refresh BMI history

    } catch (error) {
        console.error("Failed to update user data:", error);
        alert("Error updating data. Please try again.");
    }
}


// Helper function to calculate age
function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
        age--;
    }
    return age;
}

// Helper function to calculate BMI
function calculateBMI(weight, height) {
    const heightInMeters = height / 100; // Convert height to meters
    return weight / (heightInMeters ** 2);
}

// Helper function to format the user's goal
function formatPurpose(purpose) {
    const purposeMap = {
        weight_loss: "Lose Weight",
        weight_gain: "Gain Weight",
        maintenance: "Maintain Weight"
    };
    return purposeMap[purpose] || "Unknown";
}

// Function to fetch and display BMI history
async function fetchBMIHistory(userId) {
    try {
        const response = await fetch(`/api/bmi/bmi-history/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const bmiHistory = await response.json();

        // If no BMI data exists, hide the chart
        if (bmiHistory.length === 0) {
            console.warn("No BMI history found for this user.");
            document.getElementById('progressGraph').style.display = 'none';
            return;
        }

        plotBMIChart(bmiHistory);
    } catch (error) {
        console.error("Failed to fetch BMI history:", error);
    }
}

function plotBMIChart(bmiHistory) {
    const ctx = document.getElementById('progressGraph').getContext('2d');

    // Extract min and max BMI values for dynamic scaling
    const bmiValues = bmiHistory.map(entry => entry.bmi);
    const minBMI = Math.floor(Math.min(...bmiValues)) - 1; // Slightly lower
    const maxBMI = Math.ceil(Math.max(...bmiValues)) + 1;  // Slightly higher

    new Chart(ctx, {
        type: 'scatter', // Scatter plot
        data: {
            datasets: [{
                label: 'BMI Progress',
                data: bmiHistory.map(entry => ({ x: new Date(entry.date), y: entry.bmi })), // Convert date
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
                fill: false,
                showLine: true,
                tension: 0.3 // Slight smoothing for readability
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    type: 'time', // Time-based X-axis
                    time: {
                        unit: 'month',
                        tooltipFormat: 'yyyy-MM-dd' // Show full date
                    },
                    title: { display: true, text: 'Date' }
                },
                y: {
                    title: { display: true, text: 'BMI' },
                    min: minBMI,
                    max: maxBMI,
                    ticks: {
                        stepSize: 0.5, // More space between Y-axis values
                    }
                }
            }
        }
    });
}

