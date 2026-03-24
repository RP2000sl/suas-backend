const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');

const app = express();

// --- 1. Middleware Setup ---

// වෙනත් Domain (Frontend) වල සිට එන Requests වලට ඉඩ දීම (CORS)
app.use(cors());

// Incoming JSON data කියවීමට ඉඩ දීම
app.use(express.json());

// Form-data (url encoded) කියවීමට ඉඩ දීම
app.use(express.urlencoded({ extended: true }));


// --- 2. Route Definitions ---

// අපේ Analysis API එකට අදාළ Routes ලින්ක් කිරීම
app.use('/api', analysisRoutes);


// --- 3. Health Check Route (Optional) ---
// Server එක වැඩද කියලා බලන්න පොඩි Route එකක්
app.get('/', (req, res) => {
    res.send('SUAS Tool Backend is up and running!');
});


// --- 4. Global Error Handler ---
// මොකක් හරි Error එකක් ආවොත් ඒක Handle කරන්න
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server!',
        error: err.message
    });
});

module.exports = app;