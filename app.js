const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Simple route to test the server
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
