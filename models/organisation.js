const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config'); // Your Sequelize instance


const Organisation = sequelize.define('Organisation',
  {
    orgId: {
      type: DataTypes.STRING,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
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
              msg: 'Please enter your name'
          }
      }
    },
    description: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    timestamps: true
  }
);

module.exports = Organisation;
