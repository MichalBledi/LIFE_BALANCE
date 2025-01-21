// טעינת סרגל הניווט
fetch('navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    })
    .catch(err => console.error('Failed to load navbar:', err));

// לחיצה על כפתור הוספה
const addButtons = document.querySelectorAll('.add-button');
addButtons.forEach(button => {
    button.addEventListener('click', () => {
        const searchBar = document.createElement('input');
        searchBar.type = 'text';
        searchBar.placeholder = 'Search recipes...';
        button.parentNode.appendChild(searchBar);
        button.remove();
    });
});

// לחיצה על שמירת תפריט
document.getElementById('save-menu').addEventListener('click', () => {
    const userConfirmation = confirm('Are you sure you want to save this menu?');
    if (userConfirmation) {
        alert('Menu saved successfully!');
        // כאן תתווסף לוגיקה לשמירת התפריט במערכת בעתיד (למסד נתונים)
    } else {
        alert('Menu not saved. It remains visible on the screen.');
    }
});

// לחיצה על מחיקת תפריט
document.getElementById('delete-menu').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this menu?')) {
        alert('Menu deleted successfully!');
        // ניקוי הטבלה
        const cells = document.querySelectorAll('.menu-table tbody td');
        cells.forEach(cell => {
            cell.innerHTML = '<button class="add-button">+</button>';
        });
    }
});
