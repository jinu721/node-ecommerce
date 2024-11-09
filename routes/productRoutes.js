const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/multerConfig');

router.get('/',productController.homeLoad);
router.get('/shop',productController.shopLoad);
router.get('/details/:id',productController.productDetailesLoad);
router.get('/admin/products',productController.productsPageLoad);
router.post('/admin/products/add', upload.fields([
    { name: 'productImage1', maxCount: 1 },
    { name: 'productImage2', maxCount: 1 },
    { name: 'productImage3', maxCount: 1 },
    { name: 'productImage4', maxCount: 1 },
    { name: 'productImage5', maxCount: 1 }
  ]), productController.productsAdd);
router.get('/admin/products/unlist', productController.productUnlist);
router.get('/admin/update-product/:productId', productController.productUpdateLoad);


module.exports = router;