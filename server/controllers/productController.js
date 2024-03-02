const db = require('../config/db');
require('dotenv').config();
const { redisClient } = require('../config/db');
const {
  product,
  style,
  photo,
  sku,
  feature,
  related,
} = require('../models/initDB');

module.exports = {
  loaderIO: {
    getVerification: async (req, res) => {
      try {
        res.status(200).send(process.env.LOADER);
      } catch (error) {
        console.error('error with LoaderIO');
        res.status(500).send();
      }
    },
  },
  products: {
    getProducts: async (req, res) => {
      try {
        const count = !req.query.count ? 5 : Number(req.query.count);
        const page = !req.query.count ? 1 : Number(req.query.page);
        const start = (page - 1) * count;

        const products = await product.findAll({
          offset: start,
          limit: count,
          order: [['id', 'ASC']],
        });
        res.status(200).send(products);
      } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getProductInfo: async (req, res) => {
      try {
        const { id } = req.params;
        const productInfo = await product.findOne({
          where: { id },
          include: [
            {
              model: feature,
              attributes: ['feature', 'value'],
              where: { product_id: id },
            },
          ],
        });
        if (!productInfo) {
          res.status(404).send('Product not found');
          return;
        }
        res.status(200).send(productInfo);
      } catch (error) {
        console.error('Error retrieving product information:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getProductStyles: async (req, res) => {
      const { id: product_id } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 5;
      const key = `P${product_id}`;
      let response;

      try {
        const cacheResults = await redisClient.get(key);

        if (cacheResults) {
          response = JSON.parse(cacheResults);
          res.status(200).send(response);
        } else {
          const styles = await style.findAll({
            attributes: [
              'style_id',
              'name',
              'original_price',
              'sale_price',
              'default?',
            ],
            include: [
              {
                model: photo,
                attributes: ['thumbnail_url', 'url'],
                separate: true,
              },
              {
                model: sku,
                attributes: ['id', 'quantity', 'size'],
                separate: true,
              },
            ],
            where: { product_id },
            limit: pageSize,
            offset: (page - 1) * pageSize,
          });

          const resultStyles = { product_id, results: styles };
          await redisClient.set(key, JSON.stringify(resultStyles), {
            EX: 600,
          });
          res.status(200).send(resultStyles);
        }
      } catch (error) {
        console.error('Error retrieving product styles:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getRelatedProducts: async (req, res) => {
      try {
        const { id } = req.params;
        const relatedProducts = await related.findAll({
          attributes: [
            [
              db.sequelize.fn(
                'array_agg',
                db.sequelize.col('related_product_id')
              ),
              'result',
            ],
          ],
          where: { product_id: id },
          group: ['product_id'],
          raw: true,
        });
        const resultArray =
          relatedProducts.length > 0 ? relatedProducts[0].result : [];

        res.status(200).send(resultArray);
      } catch (error) {
        console.error('Error retrieving related products:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  },
};
