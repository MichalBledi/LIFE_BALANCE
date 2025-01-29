document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerButton = document.getElementById('register-btn');

    if (!loginForm) {
        console.error("Error: 'loginForm' not found in the DOM.");
        return; // Stop execution if the form is missing
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
    
            const text = await response.text(); // קבלת התגובה כדי לבדוק אם היא JSON תקין
            console.log("🔍 Server Response:", text);
    
            let data;
            try {
                data = JSON.parse(text); // ניסיון לפענח JSON
            } catch (err) {
                console.error("❌ JSON Parsing Error:", err);
                alert("Server error. Please try again.");
                return;
            }
    
            if (response.ok) {
                console.log("✅ Login Successful:", data);
                localStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem("username", data.user.username);
                window.location.href = '../home/home.html';
            } else {
                console.warn("⚠ Login Failed:", data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error("❌ Fetch Error:", error);
            alert("Network error. Please check your connection.");
        }
    });

    // טיפול בלחיצה על כפתור ההרשמה
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = '../register/steps/step-gender/step-gender.html'; // ודאי שהנתיב נכון
        });
    } else {
        console.warn("⚠ 'register-btn' not found in the DOM.");
    }
    
});
