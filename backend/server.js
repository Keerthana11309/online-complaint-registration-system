const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Middleware
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

// Base Route
app.get('/', (req, res) => {
    res.send('Online Complaint Registration API is running smoothly...');
});

const PORT = process.env.PORT || 5000;

// Offline/Local Database Connection Setup
async function startServer() {
    try {
        // Local memory server running without internet or IP restrictions
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully (In-Memory Database Ready).');

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('Database connection error:', err);
    }
}

startServer();