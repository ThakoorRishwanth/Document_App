const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');

dotenv.config();

const app = express();

app.use(express.json());

// Define a simple home route
app.get('/', (req, res) => {
    res.send('This is the home route');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
