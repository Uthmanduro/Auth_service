const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config');

class User extends Model {}

User.init({
    // Model attributes are defined here
    userId: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
                msg: 'Please enter your first name'
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
                msg: 'Please enter your last name'
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
                msg: 'Please enter your email'
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
                msg: 'Please enter your password'
            }
        }
    }, // must not be null
	phone: {
        type: DataTypes.STRING,
    }
  },
  {
    sequelize,// Other model options go here
    modelName: 'User', 
    timestamps: false,
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


class Organisation extends Model {}
Organisation.init(
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
        modelName: 'Organisation',
        timestamps: false
    }
);

const UserOrganisation = sequelize.define('UserOrganisation', {
    userId: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: 'userId'
      }
    },
    orgId: {
      type: DataTypes.STRING,
      references: {
        model: Organisation,
        key: 'orgId'
      }
    }
  });
  
User.belongsToMany(Organisation, { through: UserOrganisation, foreignKey: 'usersId' });
Organisation.belongsToMany(User, { through: UserOrganisation, foreignKey: 'orgsId' });

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
module.exports = { User, Organisation, UserOrganisation };