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
        window.location.href = '../personal_info/user_info/user_info.html'; // מפנה לדף האזור האישי
    } else {
        window.location.href = '../login/login.html'; // מפנה לדף ההתחברות
    }
}

function updateAuthButton() {
    const authButton = document.querySelector('.personal-area .text');
    if (authButton) {
        authButton.textContent = isUserLoggedIn ? 'Personal Area' : 'Log in';
    } else {
        console.error('Auth button not found');
    }
}


document.addEventListener('DOMContentLoaded', updateAuthButton);
