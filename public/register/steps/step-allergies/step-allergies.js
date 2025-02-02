document.addEventListener('DOMContentLoaded', () => {
    const activityOptions = document.querySelectorAll('.allergies-option');
    const noAllergiesOption = document.querySelector('.allergies-option.no-allergies');
    const backBtn = document.getElementById('back-button');
    const continueBtn = document.getElementById('continue-button');
    const cancelBtn = document.getElementById('cancel-button');

    activityOptions.forEach(option => {
        option.addEventListener('click', () => {
            if (option === noAllergiesOption) {
                activityOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                localStorage.setItem('allergies', 'None');
            } else {
                noAllergiesOption.classList.remove('selected');
                option.classList.toggle('selected');

                const selectedAllergies = Array.from(activityOptions)
                    .filter(opt => opt.classList.contains('selected') && opt !== noAllergiesOption)
                    .map(opt => opt.querySelector('.allergies-label').textContent.trim());
                localStorage.setItem('allergies', selectedAllergies.join(', '));
            }
        });
    }); // כאן נסגור את ה-forEach
    

    // טעינת בחירות שמורות (אם קיימות)
const savedAllergies = localStorage.getItem('allergies');
if (savedAllergies) {
    if (savedAllergies === 'None') {
        if (noAllergiesOption) {
            noAllergiesOption.classList.add('selected');
        } else {
            console.warn('noAllergiesOption not found');
        }
    } else {
        const allergiesArray = savedAllergies.split(', ');
        activityOptions.forEach(option => {
            const labelElement = option.querySelector('.allergies-label');
            if (labelElement) {
                const label = labelElement.textContent.trim();
                if (allergiesArray.includes(label)) {
                    option.classList.add('selected');
                }
            } else {
                console.warn('Label element not found in option:', option);
            }
        });
    }
}


    // כפתור חזרה
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../step-activity/step-activity.html';
        });
    }

    // כפתור המשך
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            const selectedAllergies = localStorage.getItem('allergies');
            if (!selectedAllergies || (!selectedAllergies.includes('None') && selectedAllergies.trim() === '')) {
                alert('Please select at least one allergen or "No Allergies" before continuing.');
                return;
            }
            window.location.href = '../../register.html';
        });
    
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to cancel?")) {
                window.location.href = '../../../home/home.html';
            }
        });
    }

});