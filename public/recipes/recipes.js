// טעינת ה-NAVBAR
fetch('../navbar/navbar.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('navbar').innerHTML = html;
    })
    .catch(err => console.error('Failed to load navbar:', err));

// שמירת רשימת מתכונים לכל קטגוריה
const recipesByCategory = {
    'Our Best': [
        {
            name: 'Chinese Noodles',
            time: '15 Mins',
            servings: '2',
            stars: 4.5,
            description: 'A quick and delicious noodle recipe perfect for any meal.',
            image: 'https://via.placeholder.com/300x180?text=Chinese+Noodles'
        },
        {
            name: 'Greek Yogurt Parfait',
            time: '10 Mins',
            servings: '1',
            stars: 4.0,
            description: 'A healthy and easy breakfast idea loaded with fresh fruits.',
            image: 'https://via.placeholder.com/300x180?text=Greek+Yogurt+Parfait'
        }
    ],
    Breakfast: [
        {
            name: 'Pancakes',
            time: '20 Mins',
            servings: '2',
            stars: 4.7,
            description: 'Fluffy pancakes perfect for a healthy breakfast.',
            image: 'https://via.placeholder.com/300x180?text=Pancakes'
        }
    ],
    Lunch: [
        { name: 'Caesar Salad', url: '#' },
        { name: 'Grilled Chicken', url: '#' },
    ],
    Dinner: [
        { name: 'Pasta', url: '#' },
        { name: 'Steak', url: '#' },
    ],
    Desserts: [
        { name: 'Chocolate Cake', url: '#' },
        { name: 'Ice Cream', url: '#' },
    ],
};

// בחירת אלמנטים לעדכון
const categoryTitle = document.querySelector('.category-title');
const recipeList = document.querySelector('.recipe-list');
const categoryButtons = document.querySelectorAll('.category-button');

// פונקציה לעדכון הכותרת והרשימה
function updateCategory(category) {
    // עדכון כותרת
    categoryTitle.textContent = category;

    // עדכון רשימת מתכונים
    recipeList.innerHTML = ''; // מנקה את הרשימה
    const recipes = recipesByCategory[category] || [];
    recipes.forEach(recipe => {
        recipeList.insertAdjacentHTML('beforeend', createRecipeCard(recipe));
    });

    // עדכון כפתור פעיל
    categoryButtons.forEach(button => {
        if (button.dataset.category === category) {
            button.setAttribute('aria-selected', 'true');
        } else {
            button.setAttribute('aria-selected', 'false');
        }
    });
}

// הוספת מאזין אירועים לכפתורי הקטגוריות
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category; // מקבל את שם הקטגוריה
        updateCategory(category);
    });
});

function createRecipeCard(recipe) {
    return `
        <li class="recipe-item">
            <div class="card">
                <div class="header">
                    <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                    <div class="icon">
                        <a href="#"><i class="fa fa-heart-o"></i></a>
                    </div>
                </div>
                <div class="text">
                    <h1 class="food">${recipe.name}</h1>
                    <i class="fa fa-clock-o"> ${recipe.time}</i>
                    <i class="fa fa-users"> Serves ${recipe.servings}</i>
                    <div class="stars">
                        ${renderStars(recipe.stars)}
                    </div>
                    <p class="info">${recipe.description}</p>
                </div>
                <a href="#" class="btn">Let's Cook!</a>
            </div>
        </li>
    `;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating); // כוכבים מלאים
    const halfStar = rating % 1 !== 0; // חצי כוכב אם יש שארית
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return `
        ${'⭐'.repeat(fullStars)}
        ${halfStar ? '⭐' : ''}
        ${'☆'.repeat(emptyStars)}
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCategory('Our Best'); // קטגוריה ברירת מחדל
});

