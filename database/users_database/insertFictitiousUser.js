import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'OANCZfamily825131423!',
  database: 'life_balance_web',
};

(async () => {
  let connection;

  try {
    console.log('Connecting to the database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');

    // Generate multiple fictitious users
    const users = generateFakeUsers(30); // Adjust the number of users as needed

    // Insert all users into the users table
    for (const user of users) {
      const userId = await insertUser(connection, user);

      // Insert BMI records for each user
      await insertFictitiousBmiRecords(connection, userId, user.height);
    }

    console.log('All fictitious users and BMI records added successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
})();

// Function to generate multiple fake users
function generateFakeUsers(count, offset = 0) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const uniqueId = i + offset;
    const year = 1990 + (uniqueId % 10);
    const month = String((uniqueId % 12) + 1).padStart(2, '0');
    const day = '15';
    
    users.push({
      username: `User${uniqueId + 120}`,
      date_of_birth: `${year}-${month}-${day}`,
      email: `user${uniqueId + 120}@example.com`,
      password: `password${uniqueId + 1}`,
      height: (163 + Math.random() * 30).toFixed(1),
      weight: (51 + Math.random() * 40).toFixed(1),
      gender: uniqueId % 2 === 0 ? 'male' : 'female',
      activity_index: (1.2 + Math.random() * 1.3).toFixed(2),
      purpose: uniqueId % 3 === 0 ? 'weight_gain' : uniqueId % 3 === 1 ? 'weight_loss' : 'maintenance',
      allergies: uniqueId % 2 === 0 ? 'none' : 'peanuts',
    });
  }
  return users;
}

// Function to insert a user into the users table
async function insertUser(connection, user) {
  const [result] = await connection.query(
    `INSERT INTO users (username, date_of_birth, email, password, height, weight, gender, activity_index, purpose, allergies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.username,
      user.date_of_birth,
      user.email,
      user.password,
      user.height,
      user.weight,
      user.gender,
      user.activity_index,
      user.purpose,
      user.allergies,
    ]
  );

  console.log(`Fictitious user "${user.username}" inserted successfully with ID: ${result.insertId}`);
  return result.insertId;
}

// Function to insert BMI records for a user
async function insertFictitiousBmiRecords(connection, userId, heightCm) {
  const bmiRecords = generateBmiRecords(24, heightCm);

  const values = bmiRecords.map(record => [userId, record.date, record.bmi]);
  await connection.query(
    `INSERT INTO bmi_history (user_id, date, bmi) VALUES ?`,
    [values]
  );

  console.log(`Inserted ${bmiRecords.length} BMI records for user ID ${userId}`);
}

// Function to generate BMI records
function generateBmiRecords(months, heightCm) {
  const bmiRecords = [];
  const currentDate = new Date();
  let weight = 50 + Math.random() * 50; // Start weight between 50 and 100 kg

  for (let i = 0; i < months; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const formattedDate = date.toISOString().split('T')[0];
    const bmi = calculateBmi(weight, heightCm);

    bmiRecords.push({ date: formattedDate, bmi });

    // Simulate weight fluctuations
    const weightChange = (Math.random() - 0.5) * 4;
    weight += weightChange;
  }

  return bmiRecords;
}

// Function to calculate BMI
function calculateBmi(weight, heightCm) {
  const heightMeters = heightCm / 100;
  return (weight / (heightMeters * heightMeters)).toFixed(2);
}
