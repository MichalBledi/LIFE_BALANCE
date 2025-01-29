import db from './database/db.js';
import { createUsersTables } from './database/users_database/createUsersTables.js';
import { createNutritionsTables } from './database/nutrition_database/importNutritionData.js';
import { createBmiTables } from './database/populateBMI_database/globalBMI.js';
import { createRecipesTables } from './database/recipes_database/importRecipes.js'
import { createAllergiesIndex } from './database/allergiesindex.js';;
import { createFictitiousUser } from './database/users_database/insertFictitiousUsersData.js';

const dbName = 'life_balance_web';

/* Function to create the database */
async function createDatabase() {
    let connection;
    try {
        console.log('🚀 Connecting to MySQL server...');
        console.log(`🔍 Checking if database "${dbName}" exists...`);
        await db.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✅ Database "${dbName}" is ready.`);
    } catch (error) {
        console.error('❌ Error creating database:', error);
        process.exit(1); // Stop execution if database creation fails
    } /*finally {
        if (db) {
            await db.end();
        }
    }*/
}

/* Function to run all table creation and data import scripts */
async function runScripts() {
    //const connection = await mysql.createConnection(dbConfig);
    try {
        /*
        await createUsersTables(connection);
        await createNutritionsTables(connection);
        await createBmiTables(connection);
        await createRecipesTables(connection);
        await createAllergiesIndex(connection);
        */
        await createUsersTables(db);
        await createNutritionsTables(db);
        await createBmiTables(db);
        await createRecipesTables(db);
        await createAllergiesIndex(db);
        await createFictitiousUser(db);
    } catch (error) {
        console.error('❌ Error running scripts:', error);
    } finally {
        await db.end();
        console.log('✅ All database scripts executed successfully!');
    }
}

// Run the full process
(async () => {
    await createDatabase();
    await runScripts();
})();
