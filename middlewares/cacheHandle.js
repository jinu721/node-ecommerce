// const express = require('express');
// const app = express();


// function cacheMiddleware(req, res, next) {
//     if (['/cart', '/checkout', '/login','/register'].includes(req.url)) {
//         res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//         res.set('Pragma', 'no-cache');
//         res.set('Expires', '0');
//         return next();
//     } 
//     next();
// }

// module.exports = cacheMiddleware;
