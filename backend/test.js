import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' }); // Ensure the path matches your project structure
console.log('Environment Path: ./config/config.env');
console.log('MONGO_URL:', process.env.MONGO_URL);
