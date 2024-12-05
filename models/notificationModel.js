const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  }, 
  message: { 
    type: String, 
    required: true 
  }, 
  type: { 
    type: String, 
    enum: ['order',, 'promo', 'system', 'other'], 
    default: 'other' 
  },
  status:{
    type: String, 
    enum: ['success', 'failed', 'pending'], 
    default: 'other' 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  metadata: { 
    type: Object, 
    default: null 
  }, 
  createdAt: { 
    type: Date, 
    default: Date.now 
  } 
});

module.exports = mongoose.model('Notification', notificationSchema);
