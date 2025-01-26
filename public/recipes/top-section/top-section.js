fetch('../../navbar/sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-container').innerHTML = data;
    });

// Load the filter bar HTML
fetch('top-section/filterbar.html')
    .then(response => response.text())
    .then(data => {
        const filterbarContainer = document.getElementById('filterbar-container');
        filterbarContainer.innerHTML = data;

        // Dynamically load the CSS for the filter bar
        const filterbarCss = document.createElement('link');
        filterbarCss.rel = 'stylesheet';
        filterbarCss.href = 'top-section/filterbar.css'; // Path to your CSS file
        document.head.appendChild(filterbarCss);

        // Dynamically load the JavaScript for the filter bar
        const filterbarScript = document.createElement('script');
        filterbarScript.src = 'top-section/filterbar.js'; // Path to your JS file
        document.body.appendChild(filterbarScript);
    })
    .catch(error => {
        console.error('Error loading filter bar:', error);
    });
    
