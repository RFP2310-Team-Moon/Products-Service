const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('../server/db.js');
const { Related } = require('../postgres.sql');
require('dotenv').config();

const batchSize = 100;
let batchRows = [];

const processRow = async (row) => {
  try {
    return {
      related_product_id: row.id,
      product_id: row.current_product_id,
      related_products: row.related_product_id,
    };
  } catch (error) {
    console.error('Error processing row:', error);
    return null;
  }
};

const stream = fs
  .createReadStream(
    `${process.env.DATA_PATH}/Products-Service/data/related.csv`
  )
  .pipe(csv())
  .on('data', async (row) => {
    const transformedRow = await processRow(row);
    if (transformedRow) {
      batchRows.push(transformedRow);

      if (batchRows.length === batchSize) {
        await Related.bulkCreate(batchRows);
        console.log(
          `Batch of ${batchSize} rows loaded into the database successfully`
        );
        batchRows = [];
      }
    }
  })
  .on('end', async () => {
    if (batchRows.length > 0) {
      await Related.bulkCreate(batchRows);
      console.log(
        `Last batch of ${batchRows.length} rows loaded into the database successfully`
      );
    }
    await sequelize.close();
    console.log('CSV file successfully processed');
  })
  .on('error', (error) => console.error('Error reading CSV file:', error));
