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

        // Load the CSS for the filter bar
        const filterbarCss = document.createElement('link');
        filterbarCss.rel = 'stylesheet';
        filterbarCss.href = 'top-section/filterbar.css';
        document.head.appendChild(filterbarCss);

        // Load the JavaScript for the filter bar and wait for it to be executed
        const filterbarScript = document.createElement('script');
        filterbarScript.src = 'top-section/filterbar.js';
        filterbarScript.onload = () => {
            console.log('filterbar.js loaded successfully.');
            document.dispatchEvent(new Event('filterbarLoaded'));
        };
        document.body.appendChild(filterbarScript);
    })
    .catch(error => {
        console.error('Error loading filter bar:', error);
    });

    
