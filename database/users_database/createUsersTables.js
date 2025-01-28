import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '0908',
  database: 'life_balance_web',
};

(async () => {
  let connection;

  try {
    console.log('Connecting to the database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');

    // Create the users table
    console.log('--- Creating `users` table ---');
    await createUsersTable(connection);

    // Create the saved_recipes table
    console.log('--- Creating `saved_recipes` table ---');
    await createSavedRecipesTable(connection);

    // Create the bmi_history table
    console.log('--- Creating `bmi_history` table ---');
    await createBmiHistoryTable(connection);

    console.log('All tables created successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
})();

// Function to create the `users` table
async function createUsersTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      date_of_birth DATE NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      height DECIMAL(5,2) NOT NULL,
      weight DECIMAL(5,2) NOT NULL,
      gender ENUM('male', 'female', 'other') NOT NULL,
      activity_index DECIMAL(4,2) NOT NULL COMMENT 'Activity level index (e.g., 1.2 for sedentary)',
      purpose ENUM('weight_loss', 'weight_gain', 'maintenance') NOT NULL COMMENT 'User’s fitness purpose',
      allergies TEXT COMMENT 'Comma-separated list of allergies'
    ) ENGINE=InnoDB;
  `);
  console.log('`users` table created successfully.');
}

// Function to create the `saved_recipes` table
async function createSavedRecipesTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS saved_recipes (
  user_id INT NOT NULL,
  recipe_id INT NOT NULL,
  saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, recipe_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

  `);
  console.log('`saved_recipes` table created successfully.');
}

// Function to create the `bmi_history` table
async function createBmiHistoryTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS bmi_history (
      user_id INT NOT NULL,
      date DATE NOT NULL,
      bmi DECIMAL(5,2) NOT NULL,
      PRIMARY KEY (user_id, date), -- Composite primary key
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
  `);
  console.log('`bmi_history` table created successfully.');
}

