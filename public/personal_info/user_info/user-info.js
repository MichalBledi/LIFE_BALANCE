document.addEventListener("DOMContentLoaded", () => {
    // Example progress chart initialization
    const ctx = document.getElementById('progressGraph').getContext('2d');
    const progressGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'BMI Progress',
                data: [20.7, 20.5, 20.3, 20.1],
                borderColor: '#43a047',
                backgroundColor: 'rgba(67, 160, 71, 0.2)',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#43a047',
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'BMI'
                    }
                }
            }
        }
    });

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
