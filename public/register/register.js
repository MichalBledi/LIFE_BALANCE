document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect user input
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const birthDate = document.getElementById('birth-date').value.trim();

        // Collect previously saved data from localStorage
        const gender = localStorage.getItem('gender') || '';
        const goal = localStorage.getItem('goal') || '';
        const height = localStorage.getItem('height') || '';
        const weight = localStorage.getItem('weight') || '';
        const bmiUnit = localStorage.getItem('bmiUnit') || '';
        const activity = localStorage.getItem('activity') || '';
        const allergies = localStorage.getItem('allergies') || 'None';

        try {
            // Send registration request to the server
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username, email, password, birthDate,
                    gender, goal, height, weight, bmiUnit, activity, allergies
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Clear all existing local storage data
                localStorage.clear();
                // Save user data to LocalStorage after successful registration
                const user = {
                    username,
                    email,
                    birthDate,
                    gender,
                    goal,
                    height,
                    weight,
                    activity,
                    allergies,
                };
                localStorage.setItem('user', JSON.stringify(user)); // Save user data
                alert('User registered successfully!');
                window.location.href = '../home/home.html'; // Redirect to home
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
