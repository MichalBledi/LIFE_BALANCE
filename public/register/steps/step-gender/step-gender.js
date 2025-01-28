/*************************************************************
 * בעת טעינת הדף:
 * - נטען את המגדר שנשמר (אם קיים)
 * - נוסיף מאזינים לכפתורי Back ו-Continue
 * - נוסיף מאזינים לבחירת מגדר
 * - נעדכן את פס ההתקדמות (אם תרצי להשאיר פס התקדמות)
 *************************************************************/
document.addEventListener('DOMContentLoaded', () => {
    loadGender();
    updateProgressBar();
  
    const backBtn = document.getElementById('back-button');
    const continueBtn = document.getElementById('continue-button');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        saveGender();
        window.location.href = '../../../home/home.html';
      });
    }
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        const chosenGender = localStorage.getItem('gender');
        if (!chosenGender) {
          alert('Please select your gender before continuing.');
          return;
        }
        saveGender();
        window.location.href = '../step-goal/step-goal.html';
      });
    }
  
    const genderOptions = document.querySelectorAll('.gender-option');
    genderOptions.forEach(option => {
      option.addEventListener('click', () => {
        // מסירים סימון מכולם
        genderOptions.forEach(opt => opt.classList.remove('selected'));
        // מוסיפים לעצמנו
        option.classList.add('selected');
  
        const genderLabel = option.querySelector('.gender-label').textContent.toLowerCase().trim();
        localStorage.setItem('gender', genderLabel);
      });
    });

    const cancelBtn = document.getElementById('cancel-button');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to cancel?")) {
                window.location.href = '../../../home/home.html';
            }
        });
    }

  });
  
  /*************************************************************
   * שמירת המגדר ל-localStorage
   *************************************************************/
  function saveGender() {
    const selected = document.querySelector('.gender-option.selected');
    if (selected) {
      const genderLabel = selected.querySelector('.gender-label').textContent.toLowerCase().trim();
      localStorage.setItem('gender', genderLabel);
    }
  }
  
  /*************************************************************
   * טעינת מגדר (אם נשמר בעבר) ולסמן אותו על המסך
   *************************************************************/
  function loadGender() {
    const savedGender = localStorage.getItem('gender');
    if (!savedGender) return; // אם אין נתון שנשמר, לא לסמן דבר

    const genderOptions = document.querySelectorAll('.gender-option');
    genderOptions.forEach(option => {
        const label = option.querySelector('.gender-label').textContent.toLowerCase().trim();
        if (label === savedGender) {
            option.classList.add('selected');
        }
    });
  }

  
  /*************************************************************
   * עדכון פס התקדמות (לא חובה)
   * אם תרצי להשאיר פס התקדמות אחוזי, תקבעי ידנית את הרוחב
   *************************************************************/
  function updateProgressBar() {
    // אם תרצי לעשות את זה דינמי, אפשר לחשב ידנית
    // כרגע, אם את בעמוד 1 מתוך 5, אפשר לשים 20% וכדומה
    // או להשאיר כפי שהגדרת ב-HTML (style="width: 20%;")
    // כאן רק דוגמה למקרה שבו תרצי לשנות משהו בקוד.
    // const progressBar = document.querySelector('.progress-bar');
    // if (progressBar) {
    //   progressBar.style.width = '20%'; 
    // }
  }
  