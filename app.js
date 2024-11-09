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
require('./services/authServiece'); 

const authCheck = require('./middlewares/authCheck');
const banCheck = require('./middlewares/banCheck');
const roleCheck = require('./middlewares/roleCheck');
const hideLogin = require('./middlewares/hideLogin');

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

app.listen(3000,()=>{
    console.log('Server started on :- http://localhost:3000/');
})