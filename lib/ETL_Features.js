const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('../server/db.js');
const { Feature } = require('../postgres.sql');
require('dotenv').config();

const rows = [];
// let lineCount = 0;
// const maxLines = 300;

fs.createReadStream(
  '/home/bzwong/hackreactor/course/Products-Service/data/features.csv'
)
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row);
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');

    const transformedData = rows.map((row) => ({
      feature_id: parseInt(row.id, 10),
      feature: row.feature,
      value: row.value,
      product_id: parseInt(row.product_id, 10),
    }));

    try {
      await sequelize.sync();
      await Feature.bulkCreate(transformedData);
      console.log('Data loaded into the database successfully');
    } catch (error) {
      console.error('Error loading data into the database:', error);
    } finally {
      await sequelize.close();
    }
  });
