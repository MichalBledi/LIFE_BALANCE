document.addEventListener("DOMContentLoaded", () => {
        const addButtons = document.querySelectorAll('.add-button');
        addButtons.forEach(button => {
            button.addEventListener('click', () => {
                alert('Add meal functionality coming soon!');
            });
        });
    
    
    const ctxWednesday = document.getElementById('caloriesChartWednesday').getContext('2d');
    new Chart(ctxWednesday, {
        type: 'doughnut',
        data: {
            labels: ['Carbs', 'Fats', 'Protein'],
            datasets: [{
                data: [246.3, 163.6, 301.2],
                backgroundColor: ['#FFA500', '#FF4500', '#1E90FF'],
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    const refreshButtons = document.querySelectorAll('.refresh-button');
    refreshButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Refreshing meals for this section! Feature coming soon.');
        });
    });
    
});
