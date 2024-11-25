const mongoose = require('mongoose');


const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', 
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactionHistory: [
    {
      transactionType: {
        type: String,
        enum: ['deposit', 'refund', 'purchase', 'wallet-to-wallet', 'manual'],
        required: true
      },
      transactionAmount: {
        type: Number,
        required: true
      },
      transactionDate: {
        type: Date,
        default: Date.now
      },
      description: {
        type: String,
        default: ''
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Wallets', walletSchema);;
