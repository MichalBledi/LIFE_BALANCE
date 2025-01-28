// Load the navbar dynamically
fetch('../navbar/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
        initializeNavbar(); // Call the function after the navbar is added
    })
    .catch(err => console.error('Failed to load navbar:', err));

function initializeNavbar() {
    const personalAreaBtn = document.getElementById('personal-area-btn');

    if (!personalAreaBtn) {
        console.error("Error: 'personal-area-btn' not found in the DOM.");
        return; // Stop execution if the button is missing
    }

    // Check if a user is stored in localStorage
    const user = localStorage.getItem('user');

    if (user) {
        // User is logged in: Show "Personal Area" and redirect to personal area
        personalAreaBtn.textContent = 'Personal Area';
        personalAreaBtn.addEventListener('click', () => {
            window.location.href = '../personal_area/personal-area.html';
        });
    } else {
        // No user logged in: Show "Log In" and redirect to login page
        personalAreaBtn.textContent = 'Log In';
        personalAreaBtn.addEventListener('click', () => {
            window.location.href = '../login/login.html';
        });
    }
}
