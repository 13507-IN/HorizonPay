const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'not_started'],
    default: 'not_started'
  },
  kycDocuments: [{
    type: {
      type: String,
      enum: ['passport', 'drivers_license', 'national_id', 'utility_bill']
    },
    documentUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferredCurrency: {
    type: String,
    enum: ['ALGO', 'USDC', 'EURC', 'BRZ'],
    default: 'USDC'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get user's display name
userSchema.methods.getDisplayName = function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.walletAddress.substring(0, 8) + '...';
};

// Method to check if user has completed KYC
userSchema.methods.isKycCompleted = function() {
  return this.kycStatus === 'verified';
};

module.exports = mongoose.model('User', userSchema);
