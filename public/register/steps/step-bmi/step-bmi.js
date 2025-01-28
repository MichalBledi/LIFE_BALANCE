/*************************************************************
 * משתנה המייצג את היחידה (metric / imperial)
 * נטען מ-localStorage אם קיים
 *************************************************************/
let currentUnit = localStorage.getItem('bmiUnit') || 'metric';

/*************************************************************
 * בעת טעינת הדף:
 * - נטען נתונים (גובה, משקל)
 * - נוסיף מאזינים לכפתורי Back / Continue
 * - נוסיף מאזינים לשדות height/weight
 * - נגדיר את היחידה הנוכחית (metric/imperial)
 * - נבצע חישוב BMI ראשוני
 *************************************************************/
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateProgressBar(); // אופציונלי

  // כפתורי Back/Continue
  const backBtn = document.getElementById('back-button');
  const continueBtn = document.getElementById('continue-button');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      saveData();
      // מעבר לעמוד הקודם לפי הגיון התהליך שלך
      window.location.href = '../step-goal/step-goal.html';
    });
  }
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      // בדוק שדות חובה
      if (!validateForm()) {
        alert('Please fill in Height and Weight.');
        return;
      }
      alert('Working');
      saveData();
      // מעבר ישיר לעמוד הבא (למשל step-activity.html)
      window.location.href = '../step-activity/step-activity.html';
    });
  }

  // האזנה לשינוי גובה/משקל
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  if (heightInput) heightInput.addEventListener('input', calculateBMI);
  if (weightInput) weightInput.addEventListener('input', calculateBMI);

  // האזנה לכפתורי יחידות
  const metricBtn = document.querySelector('.unit-button[onclick="setUnit(\'metric\')"]');
  const imperialBtn = document.querySelector('.unit-button[onclick="setUnit(\'imperial\')"]');
  if (metricBtn) {
    metricBtn.addEventListener('click', () => {
      localStorage.setItem('bmiUnit', 'metric');
    });
  }
  if (imperialBtn) {
    imperialBtn.addEventListener('click', () => {
      localStorage.setItem('bmiUnit', 'imperial');
    });
  }

  // הגדר את היחידה הנוכחית (בלי חישוב כפול)
  setUnit(currentUnit, false);
  // בצע חישוב ראשוני
  calculateBMI();

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
 * פונקציה: הגדרת יחידה (metric/imperial)
 *************************************************************/
function setUnit(unit, doCalc = true) {
  currentUnit = unit;
  localStorage.setItem('bmiUnit', currentUnit);

  const heightUnit = document.getElementById('height-unit');
  const weightUnit = document.getElementById('weight-unit');
  const buttons = document.querySelectorAll('.unit-button');

  if (heightUnit && weightUnit) {
    if (unit === 'metric') {
      heightUnit.textContent = 'cm';
      weightUnit.textContent = 'kg';
    } else {
      heightUnit.textContent = 'ft';
      weightUnit.textContent = 'lb';
    }
  }

  buttons.forEach(button => button.classList.remove('active'));
  const clickedBtn = document.querySelector(`.unit-button[onclick="setUnit('${unit}')"]`);
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  if (doCalc) {
    calculateBMI();
  }
}

/*************************************************************
 * חישוב BMI
 *************************************************************/
function calculateBMI() {
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const bmiResult = document.getElementById('bmi-result');
  const bmiMessage = document.getElementById('bmi-message');

  if (!heightInput || !weightInput) return;

  const height = parseFloat(heightInput.value);
  const weight = parseFloat(weightInput.value);

  if (height && weight) {
    let bmi;
    if (currentUnit === 'metric') {
      bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    } else {
      const heightInInches = height * 12;
      bmi = ((weight / (heightInInches ** 2)) * 703).toFixed(1);
    }
    if (bmiResult) bmiResult.textContent = bmi;

    if (bmiMessage) {
      if (bmi < 18.5) {
        bmiMessage.textContent = 'Underweight: Consider gaining some weight.';
      } else if (bmi >= 18.5 && bmi < 25) {
        bmiMessage.textContent = 'Normal: Great job maintaining a healthy weight!';
      } else if (bmi >= 25 && bmi < 30) {
        bmiMessage.textContent = 'Overweight: Consider losing some weight.';
      } else {
        bmiMessage.textContent = 'Obese: Please consult a doctor for advice.';
      }
    }
  } else {
    if (bmiResult) bmiResult.textContent = 'N/A';
    if (bmiMessage) bmiMessage.textContent = '';
  }
}

/*************************************************************
 * שמירת נתונים (גובה, משקל, יחידה)
 *************************************************************/
function saveData() {
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  if (heightInput) localStorage.setItem('height', heightInput.value);
  if (weightInput) localStorage.setItem('weight', weightInput.value);

  localStorage.setItem('bmiUnit', currentUnit);
}

/*************************************************************
 * טעינת נתונים
 *************************************************************/
function loadData() {
  const savedHeight = localStorage.getItem('height');
  const savedWeight = localStorage.getItem('weight');
  const savedUnit = localStorage.getItem('bmiUnit');

  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');

  if (heightInput && savedHeight) {
    heightInput.value = savedHeight;
  }
  if (weightInput && savedWeight) {
    weightInput.value = savedWeight;
  }
  if (savedUnit) {
    currentUnit = savedUnit; 
  }
}

/*************************************************************
 * בדיקת טופס (גובה, משקל) לפני מעבר
 *************************************************************/
function validateForm() {
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  if (!heightInput || !weightInput) return false;

  if (!heightInput.value || !weightInput.value) {
    return false;
  }
  return true;
}

/*************************************************************
 * עדכון פס התקדמות (אופציונלי)
 *************************************************************/
function updateProgressBar() {
  // אם תרצי, אפשר פשוט להציב בערך 60% ידנית, 
  // או להשאיר כפי שהגדרת ב-HTML (inline style).
  // דוגמה:
  // const progressBar = document.querySelector('.progress-bar');
  // if (progressBar) {
  //   progressBar.style.width = '60%';
  // }
}
