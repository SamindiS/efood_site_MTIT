import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    // Connect to the main database for your driver service
    const conn = await mongoose.connect(process.env.deliveryServiceDB_MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    // Connect to other microservice databases
    const orderDB = await mongoose.createConnection(process.env.orderServiceDB_MONGO_URI);
    const restaurantDB = await mongoose.createConnection(process.env.restaurantServiceDB_MONGO_URI);
    const paymentDB = await mongoose.createConnection(process.env.paymentServiceDB_MONGO_URI);
    
    // Error handling for orderDB
    orderDB.on('error', (err) => {
      console.error('Error connecting to Order DB:'.red, err);
    });
    
    // Success log for orderDB connection
    orderDB.once('open', () => {
      console.log('Order DB connected successfully'.cyan);
      console.log(`Order Service DB Connected: ${orderDB.name}`.cyan);
    });
    
    // Error handling for restaurantDB
    restaurantDB.on('error', (err) => {
      console.error('Error connecting to Restaurant DB:'.red, err);
    });
    
    // Success log for restaurantDB connection
    restaurantDB.once('open', () => {
      console.log('Restaurant DB connected successfully'.cyan);
      console.log(`Restaurant Service DB Connected: ${restaurantDB.name}`.cyan);
    });
    
    // Error handling for paymentDB
    paymentDB.on('error', (err) => {
      console.error('Error connecting to Payment DB:'.red, err);
    });
    
    // Success log for paymentDB connection
    paymentDB.once('open', () => {
      console.log('Payment DB connected successfully'.cyan);
      console.log(`Payment Service DB Connected: ${paymentDB.name}`.cyan);
    });
    
    // Define Order Schema based on the other microservice's schema
    const OrderSchema = new mongoose.Schema({
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      items: [
        {
          restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Restaurant'
          },
          menuitemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'MenuItem'
          },
          quantity: {
            type: Number,
            required: true
          },
        },
      ],
      shippingInfo: {
        address: {
          type: String,
          required: true
        },
        city: {
          type: String,
          required: true
        },
        postalCode: {
          type: String,
          required: true
        },
        country: {
          type: String,
          required: true
        },
      },
      totalAmount: {
        type: Number,
        required: true
      },
      isPaid: {
        type: Boolean,
        default: false
      },
      paidAt: {
        type: Date
      },
    }, {
      timestamps: true
    });
    
    // Create Order model
    const Order = orderDB.models.Order || orderDB.model('Order', OrderSchema);
    
    // Define Restaurant Schema
    const RestaurantSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      contact: String,
      description: String,
      address: String, // full address text or street address
      country: String,
      state: String,
      city: String,
      image: [String],
      menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
      rating: { type: Number, default: 0 },
      reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
      orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
      deliveryFee: { type: Number, default: 0 },
      status: { type: String, default: 'pending' },
      isAvailable: { type: Boolean, default: true },
      openingTime: { type: String, default: '09:00' },
      closingTime: { type: String, default: '22:00' },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });
    
    // Create Restaurant model
    const Restaurant = restaurantDB.models.Restaurant || restaurantDB.model('Restaurant', RestaurantSchema);
    
    // Log successful connection to main delivery DB
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    console.log(`Database Name: ${conn.connection.db.databaseName}`.cyan);
    
    // Return connections for further use
    return {
      conn,
      orderDB,
      restaurantDB,
      paymentDB,
      Order,
      Restaurant
    };
  } catch (error) {
    // Log connection error in red
    console.error(`Error: ${error.message}`.red.bold);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;