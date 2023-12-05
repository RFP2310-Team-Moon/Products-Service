const { DataTypes } = require('sequelize');
const { sequelize } = require('./server/db.js');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slogan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  default_price: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Style = sequelize.define('Style', {
  style_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  original_price: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sale_price: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  'default': {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
});

const Photo = sequelize.define('Photo', {
  photos_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  thumbnail_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Sku = sequelize.define('Sku', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Feature = sequelize.define('Feature', {
  feature_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  feature: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Product.hasMany(Style, { foreignKey: 'product_id' });
Style.belongsTo(Product, { foreignKey: 'product_id' });

Style.hasMany(Photo, { foreignKey: 'style_id' });
Photo.belongsTo(Style, { foreignKey: 'style_id' });

Style.hasMany(Sku, { foreignKey: 'styleid' });
Sku.belongsTo(Style, { foreignKey: 'styleid' });

Product.hasMany(Feature, { foreignKey: 'product_id' });
Feature.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { Product, Style, Photo, Sku, Feature };