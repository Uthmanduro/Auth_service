const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config'); // Your Sequelize instance

class Organisation extends Model {}

Organisation.init({
  orgId: {
    type: DataTypes.STRING,
    defaultValue: Sequelize.UUIDV4,
    primarKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
    validate: {
        notNull: {
          msg: 'Please enter your name',
        },
        notEmpty: {
            msg: 'name cannot be empty'
        }
    }
  },
  description: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Organisation',
  timestamps: true
});

module.exports = Organisation;
