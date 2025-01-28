import mysql from 'mysql2/promise';
import { faker } from '@faker-js/faker';


(async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'OANCZfamily825131423!',
    database: 'life_balance_web',
  });

  try {
    console.log('מחובר למסד הנתונים!');
    await connection.query('DELETE FROM users');
    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');

    console.log('מזריע נתוני משתמשים...');
    for (let i = 1; i <= 50; i++) {
        const username = `Piketty${i}`;
        const dateOfBirth = faker.date.between({ from: '1980-01-01', to: '2005-12-31' });
        const email = `piketty${i}@example.com`;
        const password = faker.internet.password();
        const height = faker.number.float({ min: 150, max: 200, precision: 0.1 });
        const weight = faker.number.float({ min: 50, max: 120, precision: 0.1 });
        const gender = faker.helpers.arrayElement(['male', 'female', 'other']);
        const activityIndex = faker.number.float({ min: 1.2, max: 2.0, precision: 0.1 });
        const purpose = faker.helpers.arrayElement(['weight_loss', 'weight_gain', 'maintenance']);
        const allergies = faker.helpers.arrayElement(['none', 'nuts', 'dairy', 'gluten', 'shellfish']);

      await connection.query(
        `INSERT INTO users (username, date_of_birth, email, password, height, weight, gender, activity_index, purpose, allergies)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [username, dateOfBirth, email, password, height, weight, gender, activityIndex, purpose, allergies]
      );
    }

    console.log('נתוני משתמשים הוזרעו בהצלחה!');

    console.log('מזריע נתוני מתכונים שמורים...');
    for (let userId = 1; userId <= 50; userId++) {
      const savedRecipes = new Set();

      while (savedRecipes.size < 5) {
        const recipeId = faker.number.int({ min: 1, max: 100 });
        if (!savedRecipes.has(recipeId)) {
          savedRecipes.add(recipeId);

          await connection.query(
            `INSERT INTO saved_recipes (user_id, recipe_id)
             VALUES (?, ?)`,
            [userId, recipeId]
          );
        }
      }
    }

    console.log('נתוני מתכונים שמורים הוזרעו בהצלחה!');
  } catch (error) {
    console.error('שגיאה במהלך ההזרעה:', error);
  } finally {
    await connection.end();
    console.log('החיבור למסד הנתונים נסגר.');
  }
})();
