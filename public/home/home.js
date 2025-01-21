window.addEventListener('beforeunload', () => {
    localStorage.removeItem('user');
});

const user = localStorage.getItem('user');
if (user) {
    const parsedUser = JSON.parse(user);
    document.getElementById('welcomeMessage').textContent = `Hello, ${parsedUser.firstName}`;
} else {
    document.getElementById('welcomeMessage').textContent = 'Welcome to Life Balance';
}
