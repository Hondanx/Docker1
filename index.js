const express = require("express");

// Initialize app
const port = 4000;
const app = express();

console.log("Starting the server...");  // Debugging log

// Define route
app.get('/', (req, res) => res.send('<h1>Hello Buddy!</h1>'));

// Start server
app.listen(port, () => {
    console.log('App is up and running on port 4000');
    console.log("Server is listening...");
});
