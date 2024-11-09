const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const path = require('path');

module.exports = {
    async checkoutPageLoad(req,res){
        
        res.render('checkout');
    }   
}