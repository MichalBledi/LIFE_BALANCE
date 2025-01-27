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

function updateAuthButton() {
    const authButton = document.querySelector('.personal-area .text');
    if (isUserLoggedIn) {
        authButton.textContent = 'Personal Area'; // משנה טקסט לאזור אישי
    } else {
        authButton.textContent = 'Log in'; // משנה טקסט להתחברות
    }
}

document.addEventListener('DOMContentLoaded', updateAuthButton);
