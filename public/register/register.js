document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('cancel-button');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to cancel?")) {
                window.location.href = '../../../home/home.html'; // שנה לכתובת הרצויה
            }
        });
    }

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const birthDate = document.getElementById('birth-date').value;

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, fullName, email, password, birthDate })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify({ username, fullName, email }));
            alert('User registered successfully!');
            window.location.href = '../home/home.html';
        } else {
            alert(data.message);
        }
    });
});
