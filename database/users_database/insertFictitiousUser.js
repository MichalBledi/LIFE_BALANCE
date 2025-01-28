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

    // Step 1: Generate multiple fictitious users
    const users = generateFakeUsers(10); // Adjust the number of users as needed

    // Step 2: Insert all users into the `users` table
    console.log('--- Inserting multiple fictitious users into the `users` table ---');
    for (const user of users) {
      const userId = await insertUser(connection, user);

      // Step 3: Insert BMI records for each user
      console.log(`--- Inserting BMI records for user ID ${userId} ---`);
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
    const uniqueId = i + offset; // Offset כדי למנוע כפילויות
    users.push({
      username: `User${uniqueId + 30}`, // שם משתמש ייחודי
      date_of_birth: `19${90 + (uniqueId % 10)}-0${(uniqueId % 12) + 1}-15`,
      email: `user${uniqueId + 13}@example.com`, // דוא"ל ייחודי
      password: `password${uniqueId + 1}`,
      height: 160 + Math.random() * 40, // גובה אקראי בין 160 ל-200 ס"מ
      weight: 50 + Math.random() * 50, // משקל אקראי בין 50 ל-100 ק"ג
      gender: uniqueId % 2 === 0 ? 'male' : 'female',
      activity_index: 1.2 + Math.random() * 1.3, // אינדקס פעילות בין 1.2 ל-2.5
      purpose: uniqueId % 3 === 0 ? 'weight_gain' : uniqueId % 3 === 1 ? 'weight_loss' : 'maintenance',
      allergies: uniqueId % 2 === 0 ? 'none' : 'peanuts',
    });
  }
  return users;
}


// Function to insert a user into the `users` table
async function insertUser(connection, user) {
  const result = await connection.query(
    `
    INSERT INTO users (
      username, date_of_birth, email, password, height, weight, gender, activity_index, purpose, allergies
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
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

  console.log(`Fictitious user "${user.username}" inserted successfully with ID: ${result[0].insertId}`);
  return result[0].insertId; // Return the ID of the newly inserted user
}

// Function to insert BMI records for a user
async function insertFictitiousBmiRecords(connection, userId, heightCm) {
  const bmiRecords = generateBmiRecords(24, heightCm); // Generate 24 months of BMI records

  for (const record of bmiRecords) {
    await connection.query(
      `
      INSERT INTO bmi_history (user_id, date, bmi)
      VALUES (?, ?, ?)
      `,
      [userId, record.date, record.bmi]
    );
    console.log(`BMI record for user ID ${userId} on ${record.date} inserted successfully.`);
  }
}

// Function to generate BMI records
function generateBmiRecords(months, heightCm) {
  const bmiRecords = [];
  const currentDate = new Date();
  let weight = 70 + Math.random() * 30; // Start weight between 70 and 100 kg

  for (let i = 0; i < months; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const formattedDate = date.toISOString().split('T')[0];
    const bmi = calculateBmi(weight, heightCm);

    bmiRecords.push({ date: formattedDate, bmi });
    weight += (Math.random() - 0.5) * 2; // Simulate weight fluctuations
  }

  return bmiRecords;
}

// Function to calculate BMI
function calculateBmi(weight, heightCm) {
  const heightMeters = heightCm / 100; // Convert height to meters
  return (weight / (heightMeters * heightMeters)).toFixed(2); // BMI formula: weight (kg) / height^2 (m^2)
}
