const app = require('./src/app');
const { poolPromise } = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// 1. Database Connection eka check karala Server eka start kirima
const startServer = async () => {
    try {
        // MS SQL Connection eka check karanawa
        await poolPromise;
        console.log('✅ MS SQL Database Connection: STABLE');

        // Server eka start karanawa
        app.listen(PORT, () => {
            console.log(`🚀 SUAS Backend is running on http://localhost:${PORT}`);
            console.log('--- Press Ctrl+C to stop the server ---');
        });

    } catch (err) {
        console.error('❌ Failed to start the server due to Database connection error:', err.message);
        process.exit(1); // Error ekak unoth server eka stop karanawa
    }
};

startServer();

// Unexpected errors handle kirima (Process level)
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});