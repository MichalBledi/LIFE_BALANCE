/*************************************************************
 * בעת טעינת הדף:
 * - נטען פעילות שנשמרה (אם יש)
 * - נוסיף מאזינים לכפתורי Back / Continue
 * - נוסיף מאזינים לאפשרויות activity
 * - נעדכן פס התקדמות (אופציונלי)
 *************************************************************/
document.addEventListener('DOMContentLoaded', () => {
    loadActivity();
    updateProgressBar(); // אופציונלי
  
    const backBtn = document.getElementById('back-button');
    const continueBtn = document.getElementById('continue-button');
  
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        saveActivity();
        // מעבר לעמוד קודם, למשל 'step-bmi.html'
        window.location.href = '../step-bmi/step-bmi.html';
      });
    }
  
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        // בדיקה אם נבחרה פעילות
        const chosenActivity = localStorage.getItem('activity');
        if (!chosenActivity) {
          alert('Please select your activity level before continuing.');
          return;
        }
        saveActivity();
        // מעבר לעמוד הבא, למשל 'register.html'
        window.location.href = '../step-allergies/step-allergies.html';
      });
    }
  
    // האזנה לבחירת פעילות (אם יש אלמנטים עם .activity-option)
    const activityOptions = document.querySelectorAll('.activity-option');
    activityOptions.forEach(option => {
      option.addEventListener('click', () => {
        // הסרת selected מכולם
        activityOptions.forEach(opt => opt.classList.remove('selected'));
        // סימון הנוכחי
        option.classList.add('selected');
  
        // שמירה ב-localStorage
        const activityLabel = option.querySelector('.activity-label')?.textContent.trim();
        if (activityLabel) {
          localStorage.setItem('activity', activityLabel);
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
   * פונקציה: שמירת הפעילות
   *************************************************************/
  function saveActivity() {
    const selectedOption = document.querySelector('.activity-option.selected');
    if (selectedOption) {
      const label = selectedOption.querySelector('.activity-label')?.textContent.trim();
      if (label) {
        localStorage.setItem('activity', label);
      }
    }
  }
  
  /*************************************************************
   * פונקציה: טעינת הפעילות
   *************************************************************/
  function loadActivity() {
    const savedActivity = localStorage.getItem('activity');
    if (!savedActivity) return;
  
    const activityOptions = document.querySelectorAll('.activity-option');
    activityOptions.forEach(option => {
        const label = option.querySelector('.activity-label')?.textContent.trim();
        if (label === savedActivity) {
            option.classList.add('selected');
        }
    });
}
  
  /*************************************************************
   * עדכון פס התקדמות (אופציונלי)
   *************************************************************/
  function updateProgressBar() {
    // לדוגמה, אם את בעמוד 4 מתוך 5 - 80% ?
    // document.querySelector('.progress-bar')?.style.setProperty('width', '80%');
  }
  