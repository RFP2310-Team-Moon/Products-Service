const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('../server/db.js');
const { Sku } = require('../postgres.sql');
require('dotenv').config();

const batchSize = 100;
let batchRows = [];

const transformRow = (row) => ({
  id: parseInt(row.id, 10),
  style_id: parseInt(row.styleId, 10),
  size: row.size,
  quantity: parseInt(row.quantity, 10),
});

fs.createReadStream(
  `${process.env.DATA_PATH}/Products-Service/data/skus.csv`
)
  .pipe(csv())
  .on('data', (row) => {
    const transformedRow = transformRow(row);
    batchRows.push(transformedRow);

    if (batchRows.length === batchSize) {
      Sku.bulkCreate(batchRows)
        .then(() => {
          console.log(
            `Batch of ${batchSize} rows loaded into the database successfully`
          );
          batchRows = [];
        })
        .catch((error) =>
          console.error('Error loading batch into the database:', error)
        );
    }
  })
  .on('end', async () => {
    if (batchRows.length > 0) {
      try {
        await Sku.bulkCreate(batchRows);
        console.log(
          `Last batch of ${batchRows.length} rows loaded into the database successfully`
        );
      } catch (error) {
        console.error('Error loading last batch into the database:', error);
      } finally {
        await sequelize.close();
      }
    } else {
      await sequelize.close();
    }

    console.log('CSV file successfully processed');
  })
  .on('error', (error) => console.error('Error reading CSV file:', error));
