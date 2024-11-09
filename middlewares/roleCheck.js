const userModal = require('../models/userModel');

let roleCheck = async (req, res, next) => {
    // console.log("roleCheck Middleware: ", req.url);
    // const adminRoutes = [
    //     '/admin/products',
    //     '/admin/users',
    //     '/admin/categories',
    //     '/admin/dashboard',
    //     '/admin/coupens',
    //     '/admin/orders'
    // ];
    // if (adminRoutes.includes(req.url)) {
    //     if (!req.session.loggedIn) {
    //         console.log("User not logged in. Redirecting to login page.");
    //         return res.redirect('/register');  
    //     }
    //     const email = req.session.userEmail;
    //     const user = await userModal.findOne({ email });
    //     if (user.role !== "admin") {
    //         console.log("User does not have admin privileges. Redirecting to unauthorized page.");
    //         return res.redirect('/'); 
    //     }
    // }

    return next();
};

module.exports = roleCheck;
