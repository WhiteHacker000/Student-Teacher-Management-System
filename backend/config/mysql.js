import mysql from 'mysql2/promise';
import { logger } from '../utils/logger.js';

let pool = null;

export const connectMySQL = async () => {
  try {
    const config = {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'student_management_system',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    };

    // Add SSL for PlanetScale or other cloud providers
    if (process.env.MYSQL_SSL === 'true') {
      config.ssl = {
        rejectUnauthorized: true
      };
      logger.info('🔒 MySQL SSL enabled');
    }

    pool = mysql.createPool(config);

    // Test connection
    const connection = await pool.getConnection();
    logger.info('✅ MySQL connected successfully');
    logger.info(`📍 Host: ${process.env.MYSQL_HOST}`);
    logger.info(`📍 Database: ${process.env.MYSQL_DATABASE}`);
    connection.release();
    
    return pool;
  } catch (error) {
    logger.error('❌ MySQL connection error:', error.message);
    throw error;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('MySQL pool not initialized. Call connectMySQL first.');
  }
  return pool;
};

export const closeConnection = async () => {
  if (pool) {
    await pool.end();
    logger.info('MySQL connection closed');
  }
};
