const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const productsRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');

router.get('/wishlist',wishlistController.wishlistLoad);

module.exports = router;
