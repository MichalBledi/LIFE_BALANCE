// פונקציית הטעינה הראשית
document.addEventListener("DOMContentLoaded", () => {
    // הוספת אירועים לכפתורי הוספה
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Add meal functionality coming soon!');
        });
    });

    // פעולה ללחיצה על כפתור "שמור שינויים"
    const saveButton = document.querySelector('.save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            alert('Your changes have been saved!');
        });
    } else {
        console.error('Save button not found');
    }

    // טעינת גרפים לכל ימות השבוע
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    try {
        days.forEach(day => {
            const chartElement = document.getElementById(`caloriesChart${day}`);
            if (chartElement) {
                const ctx = chartElement.getContext('2d');
                new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Carbs', 'Fats', 'Protein'],
                        datasets: [{
                            data: [246.3, 163.6, 301.2], // דוגמת נתונים
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
            } else {
                console.warn(`Chart element for ${day} not found`);
            }
        });
    } catch (error) {
        console.error('Chart.js is not loaded or elements not found:', error);
    }

    // הוספת אירועים לכפתורי רענון
    const refreshButtons = document.querySelectorAll('.refresh-button');
    refreshButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Refreshing meals for this section! Feature coming soon.');
        });
    });

    fetch('../../navbar/sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-container').innerHTML = data;
    });
/*
    // טעינת ה-sidebar
    fetch('../../navbar/sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load sidebar');
            return response.text();
        })
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
            console.log('Sidebar loaded successfully');
            initializeSidebar(); // אתחול אירועים ל-sidebar
            updateAuthButton(); // עדכון כפתור האזור האישי
        })
        .catch(err => console.error('Error loading sidebar:', err));*/

});

// פונקציית אתחול אירועים ל-sidebar
function initializeSidebar() {
    const menuButton = document.getElementById('menu-btn');
    const closeButton = document.querySelector('.close-btn');
    const sidebar = document.getElementById('sidebar');

    if (menuButton && closeButton && sidebar) {
        menuButton.addEventListener('click', toggleSidebar);
        closeButton.addEventListener('click', toggleSidebar);
        console.log('Event listeners added to sidebar buttons');
    } else {
        console.error('Sidebar elements not found');
    }
}

// פונקציית toggleSidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('menu-btn');
    const content = document.querySelector('.container');

    if (!sidebar || !menuBtn || !content) {
        console.error('Sidebar or related elements not found');
        return;
    }

    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
        menuBtn.style.display = 'block';
        content.style.marginLeft = '0';
    } else {
        sidebar.style.width = '250px';
        menuBtn.style.display = 'none';
        content.style.marginLeft = '250px';
    }
}

// פונקציית עדכון כפתור האזור האישי
function updateAuthButton() {
    const authButton = document.querySelector('.personal-area .text');
    if (authButton) {
        if (isUserLoggedIn) {
            authButton.textContent = 'Personal Area';
        } else {
            authButton.textContent = 'Log in';
        }
    } else {
        console.warn('Auth button not found');
    }
}
