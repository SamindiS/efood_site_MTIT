const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const orderDB = await mongoose.createConnection(process.env.orderServiceDB_MONGO_URI);

    const restaurantDB = await mongoose.createConnection(process.env.restaurantServiceDB_MONGO_URI);

    const deliveryDB = await mongoose.createConnection(process.env.deliveryServiceDB_MONGO_URI);

    const paymentDB = await mongoose.createConnection(process.env.paymentServiceDB_MONGO_URI);

    console.log('Connected to all MongoDB databases.');

    return {
      orderDB,
      restaurantDB,
      deliveryDB,
      paymentDB
    };

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;