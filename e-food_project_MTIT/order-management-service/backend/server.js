const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes.js');
const orderRoutes = require('./routes/orderRoutes');
const { swaggerUi, specs } = require('./swagger');

dotenv.config();

const app = express();

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

const session = require('express-session');
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true if using HTTPS
}));

app.use(express.json());

// Global DB holder
let dbConnections = {};

// Connect to databases before starting server
connectDB().then((connections) => {
  dbConnections = connections;

  // Attach DB connections to app locals (accessible in routes or middlewares)
  app.locals.dbs = dbConnections;

  app.use('/api/auth', authRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB error:', err);
  process.exit(1);
});

module.exports = app;