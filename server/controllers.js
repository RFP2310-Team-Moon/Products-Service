const db = require('./db.js');
const {
  Product,
  Style,
  Photo,
  Sku,
  Feature,
  Related,
} = require('../postgres.sql');

module.exports = {
  products: {
    getProducts: async (req, res) => {
      try {
        const count = !req.query.count ? 5 : Number(req.query.count);
        const page = !req.query.count ? 1 : Number(req.query.page);
        const start = (page - 1) * count;

        const products = await Product.findAll({
          offset: start,
          limit: count,
          order: [['product_id', 'ASC']],
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
        const productInfo = await Product.findOne({
          where: { product_id: id },
          include: [
            {
              model: Feature,
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
      try {
        const { id: product_id } = req.params;
        const styles = await db.Style.findAll({
          attributes: [
            'id',
            'name',
            'original_price',
            'sale_price',
            'default_style',
            [
              db.Sequelize.fn(
                'array_agg',
                db.Sequelize.fn(
                  'json_build_object',
                  'thumbnail_url',
                  db.Sequelize.col('photos.thumbnail_url'),
                  'url',
                  db.Sequelize.col('photos.url')
                )
              ),
              'photos',
            ],
            [
              db.Sequelize.fn(
                'json_object_agg',
                db.Sequelize.col('skus.id'),
                db.Sequelize.fn(
                  'json_build_object',
                  'quantity',
                  db.Sequelize.col('skus.quantity'),
                  'size',
                  db.Sequelize.col('skus.size')
                )
              ),
              'skus',
            ],
          ],
          include: [
            {
              model: db.Photo,
              attributes: [],
            },
            {
              model: db.Sku,
              attributes: [],
            },
          ],
          where: { product_id },
          group: ['styles.id'],
        });

        const resultArray =
          styles.length > 0 ? styles[0].toJSON() : { product_id, result: [] };

        res.status(200).send(resultArray);
      } catch (error) {
        console.error('Error retrieving product styles:', error);
        res.status(500).send('Internal Server Error');
      }
    },

    getRelatedProducts: async (req, res) => {
      try {
        const { id } = req.params;
        const relatedProducts = await Related.findAll({
          where: { product_id: id },
          attributes: ['related_products'],
        });

        const resultArray =
          relatedProducts.length > 0 ? relatedProducts[0].related_products : [];

        res.status(200).send(resultArray);
      } catch (error) {
        console.error('Error retrieving related products:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  },
};
