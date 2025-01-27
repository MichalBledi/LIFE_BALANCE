function toggleCategoryButton(event) {
    const button = event.target;
    button.classList.toggle('active');
}

function handleDone() {
    const confirmDone = confirm('Are yoe sure you want to publish this recipe?');
    if (confirmDone) {
        alert('Recipe submitted successfully!');
        window.location.href = '../user_info/user-info.html';
    }
}

function handleCancel() {
    const confirmExit = confirm('Do you want to leave this page?');
    if (confirmExit) {
        alert('All data cleared. Returning to homepage.');
        window.location.href = '../user_info/user-info.html';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        button.addEventListener('click', toggleCategoryButton);
    });

    fetch('../../navbar/sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('sidebar-container').innerHTML = data;
    });
});

// פונקציה להצגת התמונה שנבחרה
document.getElementById('addPicture').addEventListener('change', function(event) {
    const file = event.target.files[0]; // הקובץ שנבחר

    if (file) {
        const reader = new FileReader(); // יצירת FileReader לקריאת הקובץ

        // כאשר הקריאה מסתיימת
        reader.onload = function(e) {
            // מציאת אלמנט התמונה
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result; // הגדרת URL התמונה
            previewImage.style.display = 'block'; // הצגת התמונה
        };

        reader.readAsDataURL(file); // קריאת הקובץ כ-Data URL
    }
});

// פונקציה להוספת שדה חדש עבור מרכיב
function addIngredientInput() {
    const inputsWrapper = document.querySelector('.inputs-wrapper');

    // הסתרת כפתור הפלוס של התיבה הקודמת
    const allAddMoreButtons = inputsWrapper.querySelectorAll('.add-more');
    allAddMoreButtons.forEach(button => {
        button.style.display = 'none'; // מסתיר את כל כפתורי הפלוס הקיימים
    });

    // יצירת div חדש עבור input-group
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    // יצירת תיבת טקסט חדשה
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'ingredients';
    input.placeholder = 'Enter ingredient';
    input.className = 'ingredient-input';

    // יצירת כפתור פלוס
    const addMoreButton = document.createElement('span');
    addMoreButton.className = 'add-more';
    addMoreButton.textContent = '+';
    addMoreButton.onclick = addIngredientInput;

    // הוספת התיבה והכפתור לקבוצה
    inputGroup.appendChild(input);
    inputGroup.appendChild(addMoreButton);

    // הוספת הקבוצה ל-wrapper
    inputsWrapper.appendChild(inputGroup);
}


function addDirectionInput() {
    const directionsWrapper = document.querySelector('#directionsContainer');

    // הסתרת כפתור הפלוס של התיבה הקודמת
    const allAddMoreButtons = directionsWrapper.querySelectorAll('.add-more');
    allAddMoreButtons.forEach(button => {
        button.style.display = 'none'; // מסתיר את כל כפתורי הפלוס הקיימים
    });

    // יצירת div חדש עבור input-group
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    // יצירת תיבת טקסט חדשה
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'directions';
    input.placeholder = 'Enter preparation step';
    input.className = 'direction-input';

    // יצירת כפתור פלוס
    const addMoreButton = document.createElement('span');
    addMoreButton.className = 'add-more';
    addMoreButton.textContent = '+';
    addMoreButton.onclick = addDirectionInput;

    // הוספת התיבה והכפתור לקבוצה
    inputGroup.appendChild(input);
    inputGroup.appendChild(addMoreButton);

    // הוספת הקבוצה ל-wrapper
    directionsWrapper.appendChild(inputGroup);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar-container');
    const body = document.body;

    if (sidebar.classList.contains('open')) {
        // סגירת התפריט
        sidebar.classList.remove('open');
        body.classList.remove('sidebar-open');
    } else {
        // פתיחת התפריט
        sidebar.classList.add('open');
        body.classList.add('sidebar-open');
    }
}
