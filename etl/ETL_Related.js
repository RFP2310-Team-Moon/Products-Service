const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('../server/config/db');
const { Related } = require('../server/models/initDB');
require('dotenv').config();

const batchSize = 100;
let groupedRows = {};

async function insertBatchIntoDatabase(batch) {
  try {
    await Related.bulkCreate(Object.values(batch));
    console.log(
      `Batch of ${
        Object.keys(batch).length
      } rows loaded into the database successfully`
    );
  } catch (error) {
    console.error('Error loading batch into the database:', error);
  } finally {
    groupedRows = {};
  }
}
const transformRow = (row) => ({
  related_product_id: parseInt(row.id, 10),
  product_id: parseInt(row.current_product_id, 10),
  related_products: [parseInt(row.related_product_id, 10)],
});

fs.createReadStream(
  `${process.env.DATA_PATH}/Products-Service/data/related.csv`
)
  .pipe(csv())
  .on('data', (row) => {
    try {
      const transformedRow = transformRow(row);
      const productId = transformedRow.product_id;

      if (groupedRows[productId]) {
        groupedRows[productId].related_products.push(
          ...transformedRow.related_products
        );
      } else {
        groupedRows[productId] = transformedRow;
      }

      if (Object.keys(groupedRows).length === batchSize) {
        insertBatchIntoDatabase(groupedRows);
      }
    } catch (error) {
      console.error('Error processing row:', error);
    }
  })
  .on('end', async () => {
    if (Object.keys(groupedRows).length > 0) {
      insertBatchIntoDatabase(groupedRows);
    }

    await sequelize.close();

    console.log('CSV file successfully processed');
  })
  .on('error', (error) => console.error('Error reading CSV file:', error));
