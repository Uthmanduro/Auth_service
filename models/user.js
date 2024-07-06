const { Sequelize, DataTypes } = require('sequelize');
const Organisation = require('./organisation');
const UserOrganisation = require('./userOrganisation');
const bcrypt = require('bcryptjs');
const sequelize = require('../config');

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    userId: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
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
	password : {
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
    sequelize,// Other model options go here
    hooks: {
        beforeCreate: async (user, options) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
  }
);


//define associations
User.belongsToMany(Organisation, { through: UserOrganisation, foreignKey: 'userId' });
Organisation.belongsToMany(User, { through: UserOrganisation, foreignKey: 'orgId' });



// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
module.exports = User;