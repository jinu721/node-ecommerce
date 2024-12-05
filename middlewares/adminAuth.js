let adminCheck = (req, res, next) => {
    // if (['/admin/dashboard', '/admin/users', '/admin/products','/admin/categories'].includes(req.url)) {
    //     if (!req.session.AdminloggedIn) {
    //         return res.redirect('/admin');
    //     }
    //     return next();
    // } else if (req.url==='/admin') {
    //     if (req.session.AdminloggedIn) {
    //         return res.redirect('/admin/dashboard');
    //     }
    //     return next();
    // }
    return next();
};

module.exports = adminCheck;
