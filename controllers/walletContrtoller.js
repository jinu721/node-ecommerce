const walletModel = require('../models/walletModel');

module.exports = {
    async walletPageLoad(req,res){
        const {currentId} = req.session;
        console.log(currentId)
        try{
            const wallet = await walletModel.findOne({ userId: currentId }).lean();
            console.log(wallet)
            if(!wallet){
                return res.status(400).json({val:false,msg:'No wallet found!'});
            }
            console.log(wallet)
            res.status(200).json({val:true,wallet});
        }catch(err){
            console.log(err);
            res.status(500).json({val:false,msg:err});
        }
    }
}
