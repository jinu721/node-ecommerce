const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const upload = require('../utils/multerConfig');


router.get('/admin/categories',categoryController.categoryLoadAdmin)
router.post('/admin/category/add',upload.single('categoryImage'),categoryController.categoryAdd);
router.get('/category/:categoryId/',categoryController.categoryLoad);
router.get('/admin/category/unlist', categoryController.categoryUnlist);

module.exports = router;