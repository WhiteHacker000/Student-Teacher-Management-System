import { connectMySQL, getPool, closeConnection as closeMySQLConnection } from './mysql.js';
import { logger } from '../utils/logger.js';

let dbInstance = null;

export const connectDatabase = async () => {
  try {
    logger.info('🔄 Connecting to MySQL...');
    dbInstance = await connectMySQL();
    return { type: 'mysql', instance: dbInstance };
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const getDatabase = () => {
  return getPool();
};

export const getDatabaseType = () => 'mysql';

export const closeDatabase = async () => {
  await closeMySQLConnection();
};

// Execute query for MySQL
export const executeQuery = async (query, params = []) => {
  const db = getDatabase();
  const [rows] = await db.execute(query, params);
  return rows;
};

// Get single row
export const executeQuerySingle = async (query, params = []) => {
  const db = getDatabase();
  const [rows] = await db.execute(query, params);
  return rows[0] || null;
};

// Transaction helper
export const executeTransaction = async (callback) => {
  const db = getDatabase();
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
