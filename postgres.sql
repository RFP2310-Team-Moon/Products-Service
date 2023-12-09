const { DataTypes } = require('sequelize');
const { sequelize } = require('./server/db.js');

const product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  slogan: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  default_price: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
},
{
  timestamps: false,
});

const style = sequelize.define('style', {
  style_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  original_price: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  sale_price: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  'default?': {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
},
{
  timestamps: false,
});

const photo = sequelize.define('photo', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  thumbnail_url: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
},
{
  timestamps: false,
});

const sku = sequelize.define('sku', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  size: {
    type: DataTypes.STRING(1000),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
},
{
  timestamps: false,
});

const feature = sequelize.define('feature', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  feature: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  value: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
},
{
  timestamps: false,
});

const related = sequelize.define('related', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    autoIncrement: true,
    primaryKey: true,
  },
  related_product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
},
{
  timestamps: false,
});


product.hasMany(style, { foreignKey: 'product_id' });
style.belongsTo(product, { foreignKey: 'product_id' });

style.hasMany(photo, { foreignKey: 'style_id' });
photo.belongsTo(style, { foreignKey: 'style_id' });

style.hasMany(sku, { foreignKey: 'style_id' });
sku.belongsTo(style, { foreignKey: 'style_id' });

product.hasMany(feature, { foreignKey: 'product_id' });
feature.belongsTo(product, { foreignKey: 'product_id' });

product.hasMany(related, { foreignKey: 'product_id' });
related.belongsTo(product, { foreignKey: 'product_id' });

module.exports = { product, style, photo, sku, feature, related };