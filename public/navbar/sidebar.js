function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  const content = document.getElementById('content');
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

let isUserLoggedIn = false; 

function handleAuthClick() {
    if (isUserLoggedIn) {
        window.location.href = '../personal-area'; // מפנה לדף האזור האישי
    } else {
        window.location.href = '../login/login.html'; // מפנה לדף ההתחברות
    }
}

document.addEventListener('DOMContentLoaded', updateAuthButton);

function updateAuthButton() {
    const authButton = document.querySelector('.personal-area .text');
    if (!authButton) { // אם האלמנט לא נמצא
        console.warn('אלמנט הכפתור לא נמצא בדף.');
        return;
    }

    if (isUserLoggedIn) {
        authButton.textContent = 'Personal Area'; // עדכון טקסט כשמשתמש מחובר
    } else {
        authButton.textContent = 'Log in'; // עדכון טקסט כשמשתמש לא מחובר
    }
}


document.addEventListener('DOMContentLoaded', updateAuthButton);
