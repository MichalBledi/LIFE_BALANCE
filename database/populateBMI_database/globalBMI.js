import mysql from 'mysql2/promise';
import xlsx from 'xlsx';

// Path to the Excel file
const filePath = './database/populateBMI_database/global-bmi-data.xlsx';

// Function to create the table
async function createBmiDataTable(connection) {
    console.log('Creating the `global_bmi_data` table...');
    await connection.query(`
        CREATE TABLE IF NOT EXISTS global_bmi_data (
            country VARCHAR(100) NOT NULL,
            year INT NOT NULL,
            gender ENUM('Both', 'Male', 'Female') NOT NULL,
            bmi DECIMAL(5,2) NOT NULL,
            bmi_min DECIMAL(5,2),
            bmi_max DECIMAL(5,2),
            PRIMARY KEY (country, year, gender)
        ) ENGINE=InnoDB;
    `);
    console.log('`global_bmi_data` table created successfully.');
}

// Function to read and process the Excel data
async function insertBmiData(connection) {
    console.log('Reading data from the Excel file...');
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the sheet to JSON format while preserving headers
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Extract the header row (2nd row contains "Both sexes, Male, Female")
    const headerRowIndex = 1; // Index of the row with "Countries, territories and areas"
    const headerRow = rows[headerRowIndex];
    const yearsRow = rows[headerRowIndex - 1]; // The row above with the years

    // Identify the structure: 3 columns per year
    const columns = [];
    for (let i = 1; i < headerRow.length; i += 3) {
        const year = parseInt(yearsRow[i], 10);
        if (!isNaN(year)) {
            columns.push(
                { year, gender: 'Both' },
                { year, gender: 'Male' },
                { year, gender: 'Female' }
            );
        }
    }

    console.log('Processed columns:', columns);

    // Extract the data rows
    const dataRows = rows.slice(headerRowIndex + 1);

    console.log(`Inserting ${dataRows.length} rows into the database...`);
    for (const row of dataRows) {
        const country = row[0]?.trim();
        if (!country) continue;

        for (let i = 1; i < row.length; i++) {
            const bmiString = row[i]?.trim();
            if (!bmiString) continue;

            // Extract the main BMI, min, and max from the string
            const mainBmiMatch = bmiString.match(/^([\d.]+)\s*\[/);
            const rangeMatch = bmiString.match(/\[([\d.]+)-([\d.]+)\]/);

            const bmi = mainBmiMatch ? parseFloat(mainBmiMatch[1]) : null;
            const bmiMin = rangeMatch ? parseFloat(rangeMatch[1]) : null;
            const bmiMax = rangeMatch ? parseFloat(rangeMatch[2]) : null;

            if (bmi === null) continue;

            const { year, gender } = columns[i - 1];
            try {
                await connection.query(
                    `
                    INSERT INTO global_bmi_data (country, year, gender, bmi, bmi_min, bmi_max)
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [country, year, gender, bmi, bmiMin, bmiMax]
                );
                console.log(
                    `Inserted data for ${country} (${year}, ${gender}) - BMI: ${bmi}, Min: ${bmiMin}, Max: ${bmiMax}`
                );
            } catch (error) {
                console.error(`Failed to insert data for ${country} (${year}, ${gender}): ${error.message}`);
            }
        }
    }

    console.log('All data inserted successfully.');
}

/** Function to run all table creation scripts */
export async function createBmiTables(connection) {
  try {
      // Create the table
      await createBmiDataTable(connection);
      // Insert the data
      await insertBmiData(connection);
  } catch (error) {
      console.error('❌ Error creating users-related tables:', error);
  }
}