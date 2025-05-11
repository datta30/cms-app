import mysql from 'mysql2/promise'; // Using the promise-based API
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

const initializeMySqlPool = () => {
  try {
    pool = mysql.createPool(dbConfig);
    console.log(`MySQL Pool created for database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);

    // Test the connection (optional, but good for diagnostics)
    pool.getConnection()
      .then(connection => {
        console.log('Successfully connected to the MySQL database.');
        connection.release();
      })
      .catch(err => {
        console.error('Failed to establish a connection with the MySQL database pool:', err);
        // Consider exiting if the DB connection is critical for startup
        // process.exit(1);
      });

  } catch (err) {
    console.error('Failed to create MySQL Pool:', err);
    throw err;
  }
};

initializeMySqlPool(); // Initialize pool when module is loaded

const getPool = () => {
  if (!pool) {
    console.error("MySQL Pool not initialized. Attempting to re-initialize.");
    initializeMySqlPool(); // Attempt to re-initialize if pool is not there
    if(!pool) throw new Error("MySQL Pool could not be initialized.");
  }
  return pool;
};

export default {
  getPool,
  // query: async (sql, params) => { // Example of a direct query function if needed elsewhere
  //   const connection = await pool.getConnection();
  //   try {
  //     const [rows, fields] = await connection.execute(sql, params);
  //     return rows;
  //   } finally {
  //     connection.release();
  //   }
  // }
};
