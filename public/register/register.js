document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const password = document.getElementById('password').value;
    const birthDate = document.getElementById('birthDate').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, firstName, lastName, password, birthDate })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ username, firstName, lastName }));
        alert('User registered successfully!');
        window.location.href = '../home/home.html';
    } else {
        alert(data.message);
    }

    const cancelBtn = document.getElementById('cancel-button');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to cancel?")) {
                window.location.href = '../../../home/home.html'; // שנה לכתובת הרצויה
            }
        });
    }
});