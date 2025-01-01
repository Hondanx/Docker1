// Import required modules
const express = require('express');
const { Client } = require('pg');
const redis = require('redis');
const os = require('os');

// Initialize the app
const app = express();
const port = process.env.PORT || 4000;

// PostgreSQL connection parameters
const pgUser = process.env.PG_USER || 'root'; // Use environment variable or default to 'root'
const pgPassword = process.env.PG_PASSWORD || '1923'; // Use environment variable or default to '1923'
//const pgDatabase = process.env.PG_DATABASE || 'mydb'; // Use environment variable or default to 'mydb'
const pgHost = 'postgres'; // The PostgreSQL service name from docker-compose
const pgPort = 5432; // Default PostgreSQL port

// PostgreSQL connection URI (this can be useful if you want to pass it as a string)
const uri = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}`;

// Create a connection to PostgreSQL using URI
const pgClient = new Client({
  connectionString: uri,
});
pgClient
  .connect()
  .then(() => console.log('Connected to postgress'))
  .catch((err) => console.log('Failed to connect to postgres : ',err));
// Create a connection to Redis
const redisClient = redis.createClient({
  host: 'redis', // Redis service name from docker-compose
  port: 6379,
});

// Middleware to check Redis connectivity
redisClient.on('connect', function () {
  console.log('Connected to Redis');
});

redisClient.on('error', function (err) {
  console.log('Redis error: ' + err);
});


// Route to test Redis connection
app.get('/test-redis', (req, res) => {
  redisClient.get('test_key', (err, reply) => {
    if (err) {
      console.error('Error connecting to Redis', err);
      return res.status(500).json({ error: 'Failed to connect to Redis' });
    }
    res.json({ message: 'Redis connection is working', value: reply });
  });
});

// Basic route to check if the server is up
app.get('/', (req, res) => {
  console.log('traffic from ${os.hostname}')
  res.send('Hello, this is the Node.js app running and u can see changes by docker swarm');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
