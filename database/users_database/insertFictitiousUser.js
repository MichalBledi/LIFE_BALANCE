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
  
      // Step 1: Insert a fictitious user into the `users` table
      console.log('--- Inserting a fictitious user into the `users` table ---');
      const userId = await insertFictitiousUser(connection);
  
      // Step 2: Insert fictitious BMI records for the user into the `bmi_history` table
      console.log('--- Inserting fictitious BMI records into the `bmi_history` table ---');
      await insertFictitiousBmiRecords(connection, userId);
  
      console.log('Fictitious user and BMI records added successfully.');
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      if (connection) {
        await connection.end();
        console.log('Database connection closed.');
      }
    }
  })();
  
  // Function to insert a fictitious user into the `users` table
  async function insertFictitiousUser(connection) {
    const user = {
      username: 'RoyCohen',
      date_of_birth: '1995-08-15', // Roy's birthdate
      email: 'roy.cohen@example.com',
      password: 'hashed_password', // Replace with a securely hashed password in real use
      height: 180.0, // Roy's height in cm
      weight: 75.0, // Roy's initial weight in kg
      gender: 'male',
      activity_index: 1.55, // Moderately active
      purpose: 'maintenance', // Fitness goal
      allergies: 'peanuts, shellfish', // Example allergies
    };
  
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
  
  // Function to insert fictitious BMI records into the `bmi_history` table
  async function insertFictitiousBmiRecords(connection, userId) {
    const bmiRecords = [
        { date: '2025-01-01', weight: 75.0 },
        { date: '2025-02-01', weight: 74.5 },
        { date: '2025-03-01', weight: 74.0 },
        { date: '2025-04-01', weight: 73.8 },
        { date: '2025-05-01', weight: 73.5 },
        { date: '2025-06-01', weight: 73.8 },
        { date: '2025-07-01', weight: 73.0 },
        { date: '2025-08-01', weight: 72.8 },
        { date: '2025-09-01', weight: 72.5 },
        { date: '2025-10-01', weight: 72.2 },
        { date: '2025-11-01', weight: 72.0 },
        { date: '2025-12-01', weight: 71.8 },
        { date: '2026-01-01', weight: 71.5 },
        { date: '2026-02-01', weight: 71.3 },
        { date: '2026-03-01', weight: 71.0 },
        { date: '2026-04-01', weight: 71.2 },
        { date: '2026-05-01', weight: 70.8 },
        { date: '2026-06-01', weight: 70.5 },
        { date: '2026-07-01', weight: 70.2 },
        { date: '2026-08-01', weight: 70.0 },
        { date: '2026-09-01', weight: 69.8 },
        { date: '2026-10-01', weight: 69.5 },
        { date: '2026-11-01', weight: 69.3 },
        { date: '2026-12-01', weight: 69.0 },
        { date: '2027-01-01', weight: 68.8 },
        { date: '2027-02-01', weight: 68.5 },
        { date: '2027-03-01', weight: 68.2 },
        { date: '2027-04-01', weight: 68.0 }
      ];
      
  
    for (const record of bmiRecords) {
      const bmi = calculateBmi(record.weight, 180.0); // Height is constant at 180 cm
      await connection.query(
        `
        INSERT INTO bmi_history (user_id, date, bmi)
        VALUES (?, ?, ?)
        `,
        [userId, record.date, bmi]
      );
      console.log(`BMI record for user ID ${userId} on ${record.date} inserted successfully.`);
    }
  }
  
  // Function to calculate BMI
  function calculateBmi(weight, heightCm) {
    const heightMeters = heightCm / 100; // Convert height to meters
    return (weight / (heightMeters * heightMeters)).toFixed(2); // BMI formula: weight (kg) / height^2 (m^2)
  }
  