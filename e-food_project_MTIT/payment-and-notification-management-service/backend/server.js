const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const paymentRoutes = require("./routes/payment");
const paymentController = require("./controllers/paymentController");
const { swaggerUi, specs } = require('./swagger');

dotenv.config();

const app = express();

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Use express.raw() only for the webhook route, as it requires the raw body
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// Now, apply general middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));

app.use(express.json()); // This comes AFTER webhook
app.use(express.urlencoded({ extended: true }));

let dbConnections = {};

connectDB().then((connections) => {
  dbConnections = connections;
  app.locals.dbs = dbConnections;

  // Routes
  app.use("/api/payment", paymentRoutes);

  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server due to DB error:', err);
  process.exit(1);
});

module.exports = app;
