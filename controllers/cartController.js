const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const path = require('path');

module.exports = {
    async cartPageLoad(req,res){
        try{
            const cart = await cartModel.findOne({userId:req.session.currentId});
            if(!cart||cart.items.length===0){
                return res.status(200).render('cart',{isCartEmpty:true,msg:'No items found on cart',products:null,cart:null});
            }
            const productIds = cart.items.map(item=>item.productId);
            const products = await productModel.find({_id:{$in:productIds}})
            return res.status(200).render('cart',{isCartEmpty:false,msg:null,products,cart});
        }catch(err){
            console.log(err);
        }
    },
    async addToCart(req,res){
        const {productId,price,quantity} = req.body;
        console.log(productId,price,quantity)
        try{
            if(!req.session.loggedIn){
                return res.status(400).json({val:false,msg:'Please login first'})
            }
            console.log(1)
            const cart = await cartModel.findOne({userId:req.session.currentId})
            console.log(2)
            if(!cart){
                console.log(3)
                await cartModel.create({
                    userId:req.session.currentId,
                    items:[{productId,quantity,price,total:price*quantity}],
                    cartTotal:price * quantity 
                })
                console.log(4)
                return res.status(200).json({ val:true,msg:'Item added to cart'});
            }
            console.log(5)
            const index = cart.items.findIndex(item=>item.productId.toString()===productId);
            if(index>-1){
                cart.items[index].quantity += quantity;
                cart.items[index].total += price*quantity; 
            }else{
                cart.items.push({productId,quantity,price,total:price*quantity});
            } 
            cart.cartTotal = cart.items.reduce((total, item) => total + item.total, 0);
            cart.save();       
            res.status(200).json({ val: true, msg:'Item added to cart'});
        }catch(err){
            res.status(500).json({val:false,msg:err})
        }
    },
    async deleteFromCart(req, res) {
        const { cartItemId } = req.params;
        try {
            // Remove the item from the cart
            await cartModel.updateOne(
                { userId: req.session.currentId },
                { $pull: { items: { _id: cartItemId } } }
            );
            
            // Fetch the updated cart
            const cart = await cartModel.findOne({ userId: req.session.currentId });
            
            // If cart is empty, no need to fetch products
            if (!cart || cart.items.length === 0) {
                return res.status(200).json({ val: true, msg: "Item removed from cart", cart, products: [] });
            }
    
            // Fetch products associated with remaining items in the cart
            const productIds = cart.items.map(item => item.productId);
            const products = await productModel.find({ _id: { $in: productIds } });
            res.status(200).json({ val: true, msg: "Item removed from cart", cart, products });
        } catch (err) {
            res.status(500).json({ val: false, msg: err.message, cart: null, products: [] });
        }
    }    
}