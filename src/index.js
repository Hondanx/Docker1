const express = require('express');

// Initialize app
const app = express();
const port = process.env.port || 4000;

// Log to the console
console.log("Starting the server...");

// Define a simple route
app.get('/', (req, res) => {
  res.send('<h1>Hello, Buddy!..How are u ssos</h1>');
});

// Start the server
app.listen(port, () => {
  console.log(`App is up and running on port ${port}`);
  console.log('Server is listening...');
});
