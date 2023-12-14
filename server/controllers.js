/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
const db = require('./db.js');
require('dotenv').config();
// const { redisClient } = require('./db');
const {
  product,
  style,
  photo,
  sku,
  feature,
  related,
} = require('../postgres.sql');

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
        // const count = !req.query.count ? 5 : Number(req.query.count);
        // const page = !req.query.count ? 1 : Number(req.query.page);
        const count = !req.query.count
          ? Math.floor(Math.random() * (10 - 1 + 1)) + 1
          : Number(req.query.count);
        const page = !req.query.page
          ? Math.floor(Math.random() * (10 - 1 + 1)) + 1
          : Number(req.query.page);
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
        // const { id } = req.params;
        const id = Math.floor(Math.random() * (1000011 - 900010 + 1)) + 900010;
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
      // const { id: product_id } = req.params;
      // const key = `P${product_id}`;
      // let response;
      const product_id =
        Math.floor(Math.random() * (92194 - 82975 + 1)) + 82975;

      try {
        // const cacheResults = await redisClient.get(key);

        // if (cacheResults) {
        //   response = JSON.parse(cacheResults);
        //   res.status(200).send(response);
        // } else {
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
            },
            {
              model: sku,
              attributes: ['id', 'quantity', 'size'],
            },
          ],
          where: { product_id },
          group: ['style.style_id', 'photos.id', 'skus.id'],
        });

        const resultArray =
          styles.length > 0
            ? {
                product_id,
                results: styles.map((style) => {
                  const photos = style.photos.map(({ thumbnail_url, url }) => ({
                    thumbnail_url,
                    url,
                  }));

                  const skus = style.skus.reduce(
                    (acc, { id, quantity, size }) => {
                      acc[id] = {
                        quantity,
                        size,
                      };
                      return acc;
                    },
                    {}
                  );

                  return {
                    style_id: style.style_id,
                    name: style.name,
                    original_price: style.original_price,
                    sale_price: style.sale_price,
                    'default?': style['default?'],
                    photos,
                    skus,
                  };
                }),
              }
            : { product_id, results: [] };
        // await redisClient.set(key, JSON.stringify(resultArray), {
        //   EX: 600,
        // });
        res.status(200).send(resultArray);
        // }
      } catch (error) {
        console.error('Error retrieving product styles:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getRelatedProducts: async (req, res) => {
      try {
        // const { id } = req.params;
        const id = Math.floor(Math.random() * (232648 - 209384 + 1)) + 209384;
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
