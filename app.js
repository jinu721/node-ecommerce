const express = require('express');
const app = express();
const path = require('path');
require("dotenv").config();
const session = require('express-session');
const usersRoutes = require('./routes/usersRoutes');
const accountRoutes = require('./routes/accountRoutes');
const productsRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const walletRoutes = require('./routes/walletRotes');
const couponRoutes = require('./routes/couponRoutes');
const notifyRoutes = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
require('./services/authServiece'); 

const authCheck = require('./middlewares/authCheck');
const banCheck = require('./middlewares/banCheck');
const roleCheck = require('./middlewares/roleCheck');
const hideLogin = require('./middlewares/hideLogin');
const countCheck = require('./middlewares/countCheck');
const adminCheck = require('./middlewares/adminAuth');
const visitorsCheck = require('./middlewares/countViewers');
const cacheMiddleware = require('./middlewares/cacheHandle');

// ~~~ view engine setup ~~~
app.set('view engine','ejs');
app.set('views', [path.join(__dirname, 'views', 'user'), path.join(__dirname, 'views', 'admin')]);



// ~~~ Static files setup ~~~
app.use(express.static(path.join(__dirname,'public')))

// ~~~ body parser setup ~~~
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// ~~~ Session cookie setup ~~~
app.use(session({
    secret:'key273636keySectret',
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24*30}
}));

// ~~~ Middlewares setup ~~~
app.use(authCheck);
app.use(banCheck);
app.use(roleCheck);
app.use(hideLogin);
app.use(countCheck);
app.use(adminCheck);
app.use(visitorsCheck);


app.use('/register', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});


// ~~~ User routes setup ~~~
app.use('/',usersRoutes);
app.use('/',accountRoutes);
app.use('/',productsRoutes);
app.use('/', authRoutes); 
app.use('/', adminRoutes); 
app.use('/',wishlistRoutes); 
app.use('/',categoryRoutes); 
app.use('/',cartRoutes); 
app.use('/',checkoutRoutes); 
app.use('/',orderRoutes); 
app.use('/',walletRoutes); 
app.use('/',couponRoutes); 
app.use('/',notifyRoutes); 
app.use('/',chatRoutes); 





app.listen(3000,()=>{
    console.log('Server started on :- http://localhost:3000/');
})