const userModal = require('../models/userModel');

let banCheck = async (req, res, next) => {
    console.log("banCheck Middleware: ", req.url);

    if (req.session.loggedIn) {
        const email = req.session.userEmail;
        const user = await userModal.findOne({ email });

        if (user && user.isDeleted) {
            console.log("Rendering ban page from banCheck");
            return res.render('ban');
        }
    }
    return next();
};

module.exports = banCheck;
