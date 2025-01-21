// טוען את ה-Navbar מתוך קובץ HTML חיצוני
fetch('../navbar/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    })
    .catch(err => console.error('Failed to load navbar:', err));