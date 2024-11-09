const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productsRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');

router.get('/admin/dashboard',adminController.whenDashboardLoad);
router.get('/admin/users',adminController.whenUsersLoad);
router.get('/admin/users/view/:userId',adminController.whenUsersView);
router.get('/admin/users/ban',adminController.whenUsersBan);
// router.use('/admin',productsRoutes);
// router.use('/admin',productsRoutes);
// router.use('/admin',categoryRoutes);
// router.use('/admin',categoryRoutes);

module.exports = router;
