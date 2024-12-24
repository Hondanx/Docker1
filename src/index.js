const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const { Client } = require('pg'); // Import the pg library for PostgreSQL
require('dotenv').config(); // Load environment variables from .env file

// Initialize the app
const app = express();
const port = process.env.PORT || 4000;

// Redis Configuration
const redisClient = redis.createClient({
  url: 'redis://redis:6379', // Use Docker service name "redis"
});

redisClient.on('error', (err) => console.error('Redis client error:', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// MongoDB Configuration (commented out for PostgreSQL)
const mongoUri = process.env.MONGO_URI || "mongodb://root:1923@mongo:27017/mydb";

// PostgreSQL Configuration (updated to use Docker DNS and the same user/password as MongoDB)
const postgresClient = new Client({
  connectionString: process.env.DATABASE_URL || "postgres://root:1923@postgres:5432/mydb",
});

postgresClient.on('error', (err) => console.error('PostgreSQL client error:', err));
postgresClient.on('connect', () => console.log('Connected to PostgreSQL'));

// Initialize Redis and PostgreSQL connections, then start the server
(async () => {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('Redis client connected successfully');

    // Connect to PostgreSQL (using Docker internal DNS resolution for "postgres" service)
    await postgresClient.connect();
    console.log("Successfully connected to PostgreSQL!");

    // Connect to MongoDB (commented out for PostgreSQL)
    /*
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: "admin", // Necessary for authentication with the root user
    });
    console.log("Successfully connected to MongoDB using Mongoose!");
    */

    // Start the Express server
    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1); // Exit the app if initialization fails
  }
})();

// Define routes
app.get('/', (req, res) => {
  res.send('<h1>Hello, Buddy!..How are you?</h1>');
});

// Route to test PostgreSQL connection (instead of MongoDB)
app.get('/test-postgres', async (req, res) => {
  try {
    // Create a table for testing if not exists (if you don't have one already)
    await postgresClient.query(`
      CREATE TABLE IF NOT EXISTS tests (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        age INT
      );
    `);

    // Insert a row into the "tests" table
    await postgresClient.query("INSERT INTO tests (name, age) VALUES ($1, $2)", ['John Doe', 30]);

    // Fetch all rows from the "tests" table
    const result = await postgresClient.query("SELECT * FROM tests");
    res.json(result.rows); // Send the rows back as JSON
  } catch (error) {
    console.error("Error interacting with PostgreSQL:", error);
    res.status(500).send("Failed to interact with PostgreSQL");
  }
});

// MongoDB section (commented out)
/*
const testSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const Test = mongoose.model("Test", testSchema);

app.get('/test-mongo', async (req, res) => {
  try {
    // Insert a document into the "tests" collection
    const newTest = new Test({ name: "John Doe", age: 30 });
    await newTest.save();

    // Fetch all documents from the "tests" collection
    const tests = await Test.find();
    res.json(tests);
  } catch (error) {
    console.error("Error interacting with MongoDB:", error);
    res.status(500).send("Failed to interact with MongoDB");
  }
});
*/
