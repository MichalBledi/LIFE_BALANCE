window.addEventListener('beforeunload', () => {
    localStorage.removeItem('user');
});
