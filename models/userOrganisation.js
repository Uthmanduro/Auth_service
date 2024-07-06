const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config');

const UserOrganisation = sequelize.define('UserOrganisation', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId'
    }
  },
  orgId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Organisation',
      key: 'orgId'
    }
  }
});

module.exports = UserOrganisation;