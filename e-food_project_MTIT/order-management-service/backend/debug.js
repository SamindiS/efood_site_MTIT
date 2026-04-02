const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Hash password before saving
const bcrypt = require('bcryptjs');
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

async function test() {
  try {
    console.log('Connecting to:', process.env.orderServiceDB_MONGO_URI);
    const conn = await mongoose.createConnection(process.env.orderServiceDB_MONGO_URI);
    console.log('Connected.');
    
    const User = conn.model('User', UserSchema);
    
    const email = 'test' + Date.now() + '@example.com';
    console.log('Registering user:', email);
    
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      contact: '+94712345678',
      email: email,
      password: 'password123'
    });
    
    console.log('User created:', user);
    process.exit(0);
  } catch (err) {
    console.error('ERROR OCCURRED:');
    console.error(err);
    process.exit(1);
  }
}

test();
