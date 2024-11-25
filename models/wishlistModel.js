const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    size: { type: String, required: true },
    color: { type: String },
});

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    items: [wishlistItemSchema], 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Wishlist', wishlistSchema);
