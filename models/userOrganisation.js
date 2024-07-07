const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./user'); // Import User model
const Organisation = require('./organisation'); // Import Organisation model



const UserOrganisation = sequelize.define('UserOrganisation', {
  userId: {
    type: DataTypes.STRING,
    references: {
      model: 'User',
      key: 'userId'
    }
  },
  orgId: {
    type: DataTypes.STRING,
    references: {
      model: 'Organisation',
      key: 'orgId'
    }
  }
});


// Define associations
User.belongsToMany(Organisation, { through: UserOrganisation, foreignKey: 'userId' });
Organisation.belongsToMany(User, { through: UserOrganisation, foreignKey: 'orgId' });

module.exports = UserOrganisation;