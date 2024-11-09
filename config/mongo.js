const mongoose = require('mongoose');

module.exports = async ()=>{
    try{
        await mongoose.connect('mongodb://localhost/ecommerceDB');
        console.log('Connected')
    }catch(err){
        console.log(err);
    }
};