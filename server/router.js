/* eslint-disable import/extensions */
const router = require('express').Router();
const controllers = require('./controllers.js');
require('dotenv').config();

router
  .route(`/${process.env.LOADER}`)
  .get(controllers.loaderIO.getVerification);
router.route('/products').get(controllers.products.getProducts);
router.route('/products/:id').get(controllers.products.getProductInfo);
router.route('/products/:id/styles').get(controllers.products.getProductStyles);
router
  .route('/products/:id/related')
  .get(controllers.products.getRelatedProducts);

module.exports = router;
