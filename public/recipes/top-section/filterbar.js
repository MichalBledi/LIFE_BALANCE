function togglefilterBar() {
    const filterbar = document.getElementById('filterbar');
    if (filterbar.classList.contains('open')) {
        filterbar.classList.remove('open');
    } else {
        filterbar.classList.add('open');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const filterbarContainer = document.getElementById('filterbar-container');

    // Fetch the external filter bar HTML and inject it into the container
    fetch('../../filterbar/filterbar.html')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to load filter bar content');
            }
            return response.text();
        })
        .then((html) => {
            filterbarContainer.innerHTML = html;

            // Add event listeners to buttons after content is loaded
            const applyBtn = document.querySelector('.apply-filters-btn');
            const clearBtn = document.querySelector('.clear-filters-btn');

            applyBtn?.addEventListener('click', () => {
                alert('Filters applied! (Add your logic here)');
            });

            clearBtn?.addEventListener('click', () => {
                document.querySelectorAll('.filter-content input[type="checkbox"]').forEach((checkbox) => {
                    checkbox.checked = false;
                });
            });
        })
        .catch((error) => console.error(error));
});

