const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db'); // Your Sequelize instance

class Organisation extends Model {}

Organisation.init({
  orgId: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Organisation',
  timestamps: true
});

module.exports = Organisation;
