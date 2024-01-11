const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('../server/db.js');
const { Product } = require('../postgres.sql');
require('dotenv').config();

const rows = [];

fs.createReadStream(
  `${process.env.DATA_PATH}/Products-Service/data/product.csv`
)
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row);
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');

    const transformedData = rows.map((row) => ({
      product_id: parseInt(row.id, 10),
      name: row.name,
      slogan: row.slogan,
      description: row.description,
      category: row.category,
      default_price: parseFloat(row.default_price),
    }));

    try {
      await sequelize.sync();
      await Product.bulkCreate(transformedData);
      console.log('Data loaded into the database successfully');
    } catch (error) {
      console.error('Error loading data into the database:', error);
    } finally {
      await sequelize.close();
    }
  });
