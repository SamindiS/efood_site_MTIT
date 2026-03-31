import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DriverSchema = new mongoose.Schema({
  // Existing fields
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  licenseNumber: {
    type: String,
    unique: true,
    sparse: true // Allows null values while maintaining uniqueness for non-null entries
  },
  vehicleType: {
    type: String,
    enum: ['Motorcycle', 'Car', 'Van', 'Truck']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'],
    default: 'Active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  
  // New location tracking fields
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  locationUpdatedAt: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  currentDelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    default: null
  }
}, {
  timestamps: true
});

// Index for geospatial queries
DriverSchema.index({ currentLocation: '2dsphere' });

// Password hashing middleware (kept your existing implementation)
DriverSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password (kept your existing implementation)
DriverSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Driver = mongoose.model('Driver', DriverSchema);
export default Driver;