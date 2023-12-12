require('dotenv').config();
const redis = require('redis');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.PORT,
  }
);

// let redisClient;

// (async () => {
//   redisClient = redis.createClient({ port: 3000 });
//   redisClient.on('error', (error) => console.error('Error: ', error));

//   await redisClient.connect();
// })();

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync();
    console.log('Database schema synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

// module.exports = { sequelize, redisClient };
module.exports = { sequelize };
