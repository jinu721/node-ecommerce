
// const pageBlock = (req, res, next) => {
//     if (req.url === '/success') {
//         console.log(`Last visited route: ${req.session.lastVisitedRoute}`);
//         if (req.session.lastVisitedRoute === '/checkout') {
//             req.session.lastVisitedRoute = null;
//             return next(); 
//         } else {
//             return res.status(403).send("Access denied. You must visit '/checkout' before accessing '/success'.");
//         }
//     } else {
//         req.session.lastVisitedRoute = req.url;
//         return next();
//     }
    
// };

// module.exports = pageBlock;