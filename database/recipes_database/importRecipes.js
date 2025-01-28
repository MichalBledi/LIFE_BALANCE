import mysql from 'mysql2/promise';
import xlsx from 'xlsx';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'OANCZfamily825131423!',
  database: 'life_balance_web',
};

// File path to the Excel file
const excelFilePath = './database/recipes_database/recipes.xlsx';
//const excelFilePath = './database/testt.xlsx';

// Default photo for recipes
const defaultPhoto = 'default_recipe_photo.png';

// Maximum number of records to process
const MAX_RECORDS = 50000;

(async () => {
  let connection;

  try {
    // Step 1: Connect to the database
    connection = await connectToDatabase();

    // Step 2: Create recipes table
    await createRecipesTable(connection);

    // Step 3: Process and insert data
    await processAndInsertData(connection, excelFilePath, MAX_RECORDS);

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

/** Step 1: Connect to the database */
async function connectToDatabase() {
  console.log('Connecting to the database...');
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to the database.');
  return connection;
}

/** Step 2: Create the `recipes` table */
async function createRecipesTable(connection) {
  console.log('Step 2:Creating the `recipes` table...');
  await connection.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      minutes INT NOT NULL,
      tags TEXT NOT NULL,
      nutrition TEXT NOT NULL,
      steps TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      photo VARCHAR(255) DEFAULT '${defaultPhoto}',
      uploader VARCHAR(255)
    ) ENGINE=InnoDB;
  `);
  console.log('`recipes` table created successfully.');
}

/** Step 3: Process and insert data into tables */
async function processAndInsertData(connection, filePath, maxRecords) {
  console.log(`Step 3: Reading data from the Excel file: ${filePath}`);
  const data = readExcelFile(filePath);
  console.log(`Total recipes in file: ${data.length}`);
  console.log(`Limiting to ${maxRecords} records...`);

  // Limit data to the first `maxRecords`
  const limitedData = data.slice(0, maxRecords);

  console.log('Inserting data into the `recipes` table...');
  const insertedCount = await insertRecipes(connection, limitedData);
  console.log(`Finished inserting recipes. Total inserted: ${insertedCount}/${limitedData.length}`);
}

/** Read data from an Excel file */
function readExcelFile(filePath) {
  console.log(`Loading Excel file: ${filePath}`);
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log('Excel data loaded successfully.');
  return data;
}

function validateRecord(record) {
    const requiredFields = ['name', 'minutes', 'tags', 'nutrition', 'steps', 'ingredients'];
  
    for (const field of requiredFields) {
      // Ensure the field is not null or empty
      if (!record[field] || record[field].toString().trim() === '') {
        console.error(`Invalid record detected: Missing or empty field "${field}".`);
        return false;
      }
  
      // Ensure `minutes` is a valid number
      if (field === 'minutes' && (isNaN(record.minutes) || record.minutes < 0)) {
        console.error(`Invalid "minutes" value: ${record.minutes}`);
        return false;
      }
    }
  
    return true; // Record is valid
}

/** Insert recipes into the `recipes` table */
async function insertRecipes(connection, recipes) {
    let insertedCount = 0;
  
    for (const row of recipes) {
      try {
        // Validate the record before inserting
        if (!validateRecord(row)) {
          console.log(`Skipping invalid record: ${JSON.stringify(row)}`);
          continue;
        }
  
        const { name, minutes, tags, nutrition, steps, ingredients } = row;
  
        console.log(`Processing recipe: ${name}`);
  
        // Insert the record into the database directly
        await connection.query(
          `INSERT INTO recipes (name, minutes, tags, nutrition, steps, ingredients, photo) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            name,             // Recipe name
            minutes,          // Preparation time
            tags,             // Tags (stored as-is)
            nutrition,        // Nutrition (stored as-is)
            steps,            // Steps (stored as-is)
            ingredients,      // Ingredients (stored as-is)
            defaultPhoto      // Assign default photo
          ]
        );
  
        insertedCount++;
        console.log(`Recipe "${name}" inserted successfully.`);
      } catch (err) {
        console.error(`Failed to insert recipe "${row.name || 'Unnamed'}": ${err.message}`);
      }
    }
  
    console.log(`Finished inserting records. Successfully inserted: ${insertedCount}/${recipes.length}`);
    return insertedCount;
}