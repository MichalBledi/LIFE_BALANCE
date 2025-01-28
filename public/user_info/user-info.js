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
        console.log("Server response status:", response.status);

        if (!response.ok) {
            throw new Error(`Server returned status ${response.status}`);
        }

        const user = await response.json();
        console.log("User data received:", user);

        if (!user || Object.keys(user).length === 0) {
            throw new Error("User data is empty.");
        }

        // Fill the personal information section
        document.querySelector(".user-greeting").textContent = `Welcome, ${user.username}!`;
        document.querySelector(".details-progress-container .card:nth-child(1)").innerHTML = `
            <h3>My Details</h3>
            <p><strong>User name:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Age:</strong> ${calculateAge(user.date_of_birth)}</p>
        `;

        // Calculate BMI
        const bmi = calculateBMI(user.weight, user.height);

        // Fill the progress section
        document.querySelector(".details-progress-container .card:nth-child(2)").innerHTML = `
            <h3>My Progress</h3>
            <p><strong>Current BMI:</strong> ${bmi.toFixed(2)}</p>
            <p><strong>Height:</strong> ${user.height} cm</p>
            <p><strong>Weight:</strong> ${user.weight} kg</p>
            <p><strong>Activity Level:</strong> ${user.activity_index}</p>
            <p><strong>Goal:</strong> ${formatPurpose(user.purpose)}</p>
        `;

    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error loading personal information. Please try again later.");
    }
});

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
