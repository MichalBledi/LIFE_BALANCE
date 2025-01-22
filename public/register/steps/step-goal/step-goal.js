/*************************************************************
 * בעת טעינת הדף:
 * - נטען את הבחירה (אם נשמרה)
 * - נוסיף מאזינים לכפתורי Back / Continue
 * - נוסיף מאזינים לאפשרויות goal
 * - נעדכן פס התקדמות (אופציונלי)
 *************************************************************/
document.addEventListener('DOMContentLoaded', () => {
    loadGoal();
    updateProgressBar(); // אופציונלי
  
    const backBtn = document.getElementById('back-button');
    const continueBtn = document.getElementById('continue-button');
  
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        saveGoal();
        // מעבר לעמוד קודם, למשל 'step-gender.html'
        window.location.href = '../step-gender/step-gender.html';
      });
    }
  
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        // בדיקה אם נבחרה מטרה
        const chosenGoal = localStorage.getItem('goal');
        if (!chosenGoal) {
          alert('Please select your main goal before continuing.');
          return;
        }
        saveGoal();
        // מעבר לעמוד הבא, למשל 'step-bmi.html'
        window.location.href = '../step-bmi/step-bmi.html';
      });
    }
  
    // האזנה לבחירת מטרה (אם יש אלמנטים עם .goal-option)
    const goalOptions = document.querySelectorAll('.goal-option');
    goalOptions.forEach(option => {
      option.addEventListener('click', () => {
        // הסרת selected מכולם
        goalOptions.forEach(opt => opt.classList.remove('selected'));
        // סימון הנוכחי
        option.classList.add('selected');
  
        // שמירה ב-localStorage
        // נניח שיש אלמנט עם class="goal-label" שבתוכו הטקסט
        const goalLabel = option.querySelector('.goal-label')?.textContent.trim();
        if (goalLabel) {
          localStorage.setItem('goal', goalLabel);
        }
      });
    });

    const cancelBtn = document.getElementById('cancel-button');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to cancel?")) {
                window.location.href = '../../../home/home.html'; // שנה לכתובת הרצויה
            }
        });
    }

  });
  
  /*************************************************************
   * פונקציה: שמירת הבחירה
   *************************************************************/
  function saveGoal() {
    const selectedOption = document.querySelector('.goal-option.selected');
    if (selectedOption) {
      const label = selectedOption.querySelector('.goal-label')?.textContent.trim();
      if (label) {
        localStorage.setItem('goal', label);
      }
    }
  }
  
  /*************************************************************
   * פונקציה: טעינת הבחירה הקודמת
   *************************************************************/
  function loadGoal() {
    const savedGoal = localStorage.getItem('goal');
    if (!savedGoal) return;
  
    const goalOptions = document.querySelectorAll('.goal-option');
    goalOptions.forEach(option => {
      const label = option.querySelector('.goal-label')?.textContent.trim();
      if (label === savedGoal) {
        option.classList.add('selected');
      }
    });
  }
  
  /*************************************************************
   * עדכון פס התקדמות (אופציונלי)
   *************************************************************/
  function updateProgressBar() {
    // אם תרצי, אפשר כאן לשנות את הרוחב, למשל:
    // document.querySelector('.progress-bar')?.style.setProperty('width', '40%');
    // או להשאיר את מה שמוגדר ב-HTML
  }
  