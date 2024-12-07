const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');



// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});
mongoose.connection.once('open', () => {
    console.log('Database Name:', mongoose.connection.db.databaseName);
});

// Simple route to test the server
app.get('/', (req, res) => {
    res.send('Welcome to E-commerce APIs');
});

//Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', userRoutes)


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
