require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');


const app = express();

// Connect to MongoDB
connectDB();

// enable cors
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());

app.use(authRoutes);
app.use(listingRoutes);
app.use('/api', chatRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
