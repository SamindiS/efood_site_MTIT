import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors'; // For colored console logs
import cors from 'cors';

// Import database connection
import connectDB from './Config/db.js';

// Route imports
import driverRoutes from './Routes/driverRoutes.js';
import { swaggerUi, specs } from './swagger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global DB holder
let dbConnections = {};

// Connect to databases before setting up routes
connectDB().then((connections) => {
  dbConnections = connections;

  // Make connections accessible in the app
  app.locals.dbs = dbConnections;

  // Routes
  app.use('/api/drivers', driverRoutes);

  // Handle frontend calls to /api/orders that should go to Order Service
  app.post('/api/orders/:id/claim', (req, res) => {
    res.json({ success: true, message: 'Order claimed mock' });
  });

  app.put('/api/orders/:id/status', (req, res) => {
    res.json({ success: true, message: 'Order status updated mock' });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  const MODE = process.env.NODE_ENV || 'development';

  app.listen(PORT, () => {
    console.log(`Server running in ${MODE} mode on port ${PORT}`.yellow.bold);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB error:'.red.bold, err);
  process.exit(1);
});