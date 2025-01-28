import mysql from 'mysql2/promise';
import xlsx from 'xlsx';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'OANCZfamily825131423!',
  database: 'life_balance_web',
};

// Paths to the Excel files
const excelFiles = [
  './database/nutrition_database/FOOD-DATA-GROUP1.xlsx',
  './database/nutrition_database/FOOD-DATA-GROUP2.xlsx',
  './database/nutrition_database/FOOD-DATA-GROUP3.xlsx',
  './database/nutrition_database/FOOD-DATA-GROUP4.xlsx',
  './database/nutrition_database/FOOD-DATA-GROUP5.xlsx',
];

/*
const excelFiles = [
  './database/nutrition_database/test.xlsx',
];
*/


(async () => {
  let connection;

  try {
    console.log('Connecting to the database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to the database.');

    // Step 1: Create the tables
    console.log('--- Step 1: Creating tables ---');
    await createFoodTable(connection);
    await createNutritionDescriptionsTable(connection);

    // Step 2: Insert nutrient descriptions
    console.log('--- Step 2: Inserting nutrient descriptions ---');
    await insertNutritionDescriptions(connection);

    // Step 3: Insert food data from Excel files
    console.log('--- Step 3: Inserting food data from Excel files ---');
    for (const file of excelFiles) {
      console.log(`Processing file: ${file}`);
      const data = readExcelFile(file);
      console.log(`File read successfully. Found ${data.length} rows.`);
      await insertFoodData(connection, data);
    }

    console.log('All operations completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
  }
})();

// Function to create the `food` table
async function createFoodTable(connection) {
  console.log('Creating the `food` table...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS food (
      food_name VARCHAR(255) NOT NULL,
      caloric_value DECIMAL(10,2),
      fat DECIMAL(10,2),
      saturated_fats DECIMAL(10,2),
      carbohydrates DECIMAL(10,2),
      sugars DECIMAL(10,2),
      protein DECIMAL(10,2),
      dietary_fiber DECIMAL(10,2),
      cholesterol DECIMAL(10,2),
      sodium DECIMAL(10,2),
      water DECIMAL(10,2),
      calcium DECIMAL(10,2),
      iron DECIMAL(10,2),
      potassium DECIMAL(10,2),
      vitamin_c DECIMAL(10,2),
      vitamin_d DECIMAL(10,2),
      nutrition_density DECIMAL(10,2)
    ) ENGINE=InnoDB;
  `);
  console.log('`food` table created successfully.');
}

// Function to create the `nutrition_descriptions` table
async function createNutritionDescriptionsTable(connection) {
  console.log('Creating the `nutrition_descriptions` table...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS nutrition_descriptions (
      nutrient_name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT NOT NULL
    ) ENGINE=InnoDB;
  `);
  console.log('`nutrition_descriptions` table created successfully.');
}

// Function to insert predefined descriptions into the `nutrition_descriptions` table
async function insertNutritionDescriptions(connection) {
  console.log('Inserting descriptions into the `nutrition_descriptions` table...');
  const descriptions = [
    { name: 'Caloric Value', description: 'Total energy provided by the food per 100g.' },
    { name: 'Fat', description: 'Total fats in grams per 100g.' },
    { name: 'Saturated Fats', description: 'Saturated fats in grams per 100g.' },
    { name: 'Carbohydrates', description: 'Total carbohydrates in grams per 100g.' },
    { name: 'Sugars', description: 'Total sugars in grams per 100g.' },
    { name: 'Protein', description: 'Total proteins in grams per 100g.' },
    { name: 'Dietary Fiber', description: 'Fiber content in grams per 100g.' },
    { name: 'Cholesterol', description: 'Cholesterol in milligrams per 100g.' },
    { name: 'Sodium', description: 'Sodium in milligrams per 100g.' },
    { name: 'Water', description: 'Water content in grams per 100g.' },
    { name: 'Calcium', description: 'Calcium in milligrams per 100g.' },
    { name: 'Iron', description: 'Iron in milligrams per 100g.' },
    { name: 'Potassium', description: 'Potassium in milligrams per 100g.' },
    { name: 'Vitamin C', description: 'Vitamin C in milligrams per 100g.' },
    { name: 'Vitamin D', description: 'Vitamin D in milligrams per 100g.' },
    { name: 'Nutrition Density', description: 'Overall nutrient richness per calorie.' },
  ];

  for (const item of descriptions) {
    try {
      await connection.query(
        'INSERT INTO nutrition_descriptions (nutrient_name, description) VALUES (?, ?)',
        [item.name, item.description]
      );
      console.log(`Inserted description for nutrient: ${item.name}`);
    } catch (error) {
      console.error(`Failed to insert description for "${item.name}": ${error.message}`);
    }
  }
  console.log('Descriptions inserted successfully.');
}

// Function to read data from an Excel file
function readExcelFile(filePath) {
  console.log(`Reading Excel file: ${filePath}`);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Assuming the first sheet is used
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

// Function to insert food data into the `food` table
async function insertFoodData(connection, data) {
    for (const row of data) {
      try {
        const {
          food: food_name,
          'Caloric Value': caloric_value,
          Fat: fat,
          'Saturated Fats': saturated_fats,
          Carbohydrates: carbohydrates,
          Sugars: sugars,
          Protein: protein,
          'Dietary Fiber': dietary_fiber,
          Cholesterol: cholesterol,
          Sodium: sodium,
          Water: water,
          Calcium: calcium,
          Iron: iron,
          Potassium: potassium,
          'Vitamin C': vitamin_c,
          'Vitamin D': vitamin_d,
          'Nutrition Density': nutrition_density,
        } = row;
  
        if (!food_name) {
          console.log('Skipping row with missing food name.');
          continue; // Skip rows without a food name
        }
  
        await connection.query(
          `INSERT INTO food (
            food_name, caloric_value, fat, saturated_fats, carbohydrates, sugars, protein,
            dietary_fiber, cholesterol, sodium, water, calcium, iron, potassium, vitamin_c,
            vitamin_d, nutrition_density
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            food_name, caloric_value, fat, saturated_fats, carbohydrates, sugars, protein,
            dietary_fiber, cholesterol, sodium, water, calcium, iron, potassium, vitamin_c,
            vitamin_d, nutrition_density,
          ]
        );
        console.log(`Inserted food: ${food_name}`);
      } catch (error) {
        console.error(`Failed to insert row for "${row.food || 'Unnamed'}": ${error.message}`);
      }
    }
    console.log('Food data inserted successfully.');
}
  
