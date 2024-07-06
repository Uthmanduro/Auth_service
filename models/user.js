const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    userId: {
        type: DataTypes.UUIDV4,
        primarKey: true,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please enter your first name',
            },
            notEmpty: {
                msg: 'firstname cannot be empty'
            }
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull : false, // defaults to true
        validate: {
            notNull: {
              msg: 'Please enter your last name',
            },
            notEmpty: {
                msg: 'lastname cannot be empty'
            }
        }
    },
	email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
              msg: 'Please enter your email',
            },
            notEmpty: {
                msg: 'email cannot be empty'
            }
        }
    }, // must be unique and must not be null
	passwordHash : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
              msg: 'Please enter your password',
            },
            notEmpty: {
                msg: 'password cannot be empty'
            }
        }
    }, // must not be null
	phone: {
        type: DataTypes.STRING,
    }
  },
  {
    sequelize// Other model options go here
  },
);

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
module.exports = User;