import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log('URI:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`Database: ${conn.connection.db.databaseName}`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Ready State: ${conn.connection.readyState} (1=Connected)`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`Error Code: ${error.code}`);
    console.log('⚠️  Server continuing in OFFLINE MODE - data operations will fail');
    console.log('Attempting to reconnect in 5 seconds...');
    
    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('🔄 Retrying MongoDB connection...');
      connectDB().catch(err => console.error('Retry failed:', err.message));
    }, 5000);
    
    return null;
  }
};

// Export connection status checker
export const getDBStatus = () => {
  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || 'Not connected',
    databaseName: mongoose.connection.db?.databaseName || 'N/A'
  };
};

export default connectDB;
