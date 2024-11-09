const userModel = require("../models/userModel");

module.exports = {
    whenDashboardLoad(req,res){
        res.render('dashboard');
    },
    async whenUsersLoad(req, res) {
        const { page = 1 } = req.query;  
        const limit = 7; 
        const skip = (page - 1) * limit; 
        try {
            const users = await userModel.find().skip(skip).limit(limit);
            const totalUsers = await userModel.countDocuments();  
            const totalPages = Math.ceil(totalUsers / limit); 
            return res.status(200).render("usersManagement", {
                val: users.length > 0,
                msg: users.length ? null : "No users found",
                user:users,
                currentPage: Number(page),  
                totalPages,
                pagesToShow: 3,  
            });
    
        } catch (err) {
            console.log(err);
            return res.status(500).render("usersManagement", {
                val: false,
                msg: "Error loading users",
                users: null,
                currentPage: 1,
                totalPages: 1,  
                pagesToShow: 3,
            });
        }
    },    
    async whenUsersView(req,res){
        const {userId} = req.params;
        try{
            console.log(userId)
            const user = await userModel.findOne({_id:userId});
            res.status(200).json({user});
        }catch(err){
            console.log(err)
        }
    },
    async whenUsersBan(req,res){
        const {id,val} = req.query;
        try{
            console.log(id,val)
            if(val==="Ban"){
                await userModel.updateOne({_id:id},{isDeleted:true});
            }else{
                await userModel.updateOne({_id:id},{isDeleted:false});
            }
            res.status(200).json({val:true});
        }catch(err){
            res.status(500).json({val:false});
        }
    }
};
