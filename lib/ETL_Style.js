const fs = require('fs');
const csv = require('csv-parser');
const { sequelize } = require('../server/db.js');
const { Style } = require('../postgres.sql');

const rows = [];

fs.createReadStream(
  '/home/bzwong/hackreactor/course/Products-Service/data/styles.csv'
)
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row);
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');

    const transformedData = rows.map((row, index) => {
      try {
        return {
          style_id: parseInt(row.id, 10),
          name: row.name,
          original_price: row.original_price,
          sale_price: row.sale_price,
          default: row.default_style,
          product_id: parseFloat(row.productId),
        };
      } catch (error) {
        console.error(`Error processing row ${index + 1}:`, error);
        console.log('Problematic row:', row);
        return null;
      }
    });

    const validData = transformedData.filter((data) => data !== null);

    try {
      await sequelize.sync();
      await Style.bulkCreate(validData);
      console.log('Data loaded into the database successfully');
    } catch (error) {
      console.error('Error loading data into the database:', error);
    } finally {
      await sequelize.close();
    }
  });
