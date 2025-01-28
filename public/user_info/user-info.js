document.addEventListener("DOMContentLoaded", () => {
    // Example progress chart initialization
    const ctx = document.getElementById('progressGraph').getContext('2d');
    

    // Button click listeners for editing details
    document.querySelectorAll('.change-button').forEach(button => {
        button.addEventListener('click', () => {
            alert('Edit functionality coming soon!');
        });
    });

    // Additional functionality for quick links
    const quickLinks = document.querySelectorAll('.recipe-links a');
    quickLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            alert(`Redirecting to: ${link.textContent}`);
        });
    });

    // Dynamic greeting message
    const userName = "[User Name]"; // Replace with dynamic data if available
    const greetingElement = document.querySelector('.user-greeting h2');
    if (greetingElement) {
        greetingElement.textContent = `Welcome, ${userName}!`;
    }

    // Add 'Let's Talk Food' heading
    const container = document.querySelector('.container');
    const foodHeading = document.createElement('h2');
    foodHeading.textContent = "Let's Talk Food!";
    foodHeading.style.textAlign = "center";
    foodHeading.style.marginTop = "30px";
    foodHeading.style.fontSize = "24px";
    foodHeading.style.color = "#558b2f";
    container.appendChild(foodHeading);
});
