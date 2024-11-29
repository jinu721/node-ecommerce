const mongoose = require('mongoose');
const chatMessageSchema = new mongoose.Schema({
    tokenId: { 
        type: String, 
        required: true  
    },
    sender: { 
        type: String, 
        enum: ['user', 'admin'], 
    },
    message: { 
        type: String, 
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User',  
        required: function() { return this.sender === 'user'; } 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
