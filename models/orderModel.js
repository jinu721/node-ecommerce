const mongoose = require('mongoose');
const { type } = require('os');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', 
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products', 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      offerPrice: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      color: {
        type: String,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card','wallet', 'paypal', 'razorpay', 'cash_on_delivery'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled','returned'],
    default: 'processing',
  },
  shippingAddress: {
    street: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String },
    city: { type: String, required: true },
    houseNumber: { type: String },
    landMark: { type: String },
    pinCode: { type: String, required: true },
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  deliveredAt: {
    type: Date,
  },
  returnRequest: {
    requestStatus:{type:Boolean,default:false},
    requestMessage:{type:String}
  },
  statusHistory: [
    {
      status: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled','returned'],
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Orders', orderSchema);
