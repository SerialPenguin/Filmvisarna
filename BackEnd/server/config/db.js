// const mongoose = require('mongoose');
// const dotenv = require('dotenv');

// dotenv.config();

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// db.on('error', (err) => {
//   console.error(`MongoDB connection error: ${err}`);
// });

// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// Importing modules
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configuring dotenv
dotenv.config();

// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Acquiring the connection object
const db = mongoose.connection;

// Error handling
db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Open event listener
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Exporting the connection object
export default db;