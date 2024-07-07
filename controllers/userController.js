const asyncHandler = require('express-async-handler');
const { User, Organisation, UserOrganisation } = require('../models/user.js');
//const Organisation = require('../models/organisation.js');
//const UserOrganisation = require('../models/userOrganisation.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const UserOrganisation = require('../models/userOrganisation.js');
require('dotenv').config()



const generateToken = (userId) => {
    // The payload of the JWT contains the user's id.
    const payload = { userId };
  
    // The JWT is signed with the secret key.
    const secret = process.env.JWT_SECRET;
  
    // The JWT expires in one day (86400 seconds).
    const options = {
      expiresIn: "1h",
    };
  
    // Return the signed JWT as a string.
    return jwt.sign(payload, secret, options);
  };



const registerUser = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, phone, email, password } = req.body;

        console.log('Received request with body:', req.body)


        // Create new user with the provided role
        const newUser = await User.create({
            firstName,
            lastName,
            phone,
            email,
            password,
        });

        //   Generate Token
        const token = generateToken(newUser.userId);

        const userWithoutPassword = {
            userId: newUser.userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone
        };


        // Concat firstname to organisation
        const orgName = `${firstName}'s Organisation`;

        // create organisation
        const newOrg = await Organisation.create({
            name: orgName,
            description: ""
        });

        await UserOrganisation.create({
            usersId: newUser.userId,
            orgsId: newOrg.orgId,
            // other fields...
          });


        res.status(201).json({
            "status": "success",
            "message": "Registration successful",
            "data": {
              "accessToken": token,
              "user": userWithoutPassword
            }
        });
    } catch (error) {
        console.error(error)
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            res.status(422).json({ errors });
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(e => ({
                field: e.path,
                message: e.message
            }));
            res.status(422).json({ errors });
        } else {
            res.status(400).json({
                "status": "Bad request",
                "message": "Registration unsuccessful",
                "statusCode": 400
            });
        }
    }
});



const loginUser = asyncHandler(async (req, res) => {
    try {
        // Destructure phoneNumberOrEmail and password from request body
        const { email, password } = req.body;
    
    
        // Check if user exists by searching for mail in the DB
        const user = await User.findOne({ 
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                "status": "Bad request",
                "message": "Authentication failed",
                "statusCode": 401
            });
        }
    
        // Compare entered password with hashed password in DB
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
    
        // Generate the JWT token if password is correct
        const token = generateToken(user.userId);
    
        // If user exists and password is correct
        if (user && passwordIsCorrect) {
            // Send the user data and JWT token back to the client
            const userData = {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            };
            res.status(200).json({
                "status": "success",
                "message": "Login successful",
                "data": {
                    "accessToken": token,
                    "user": userData
                }
            });
        } else {
            return res.status(401).json({
                "status": "Bad request",
                "message": "Authentication failed",
                "statusCode": 401
            });
        }
    } catch (e) {
        console.error(e);
        res.status(401).json({
            "status": "Bad request",
            "message": "Authentication failed",
            "statusCode": 401
        });
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id)

    // Check if user exists by searching for mail in the DB
    const user = await User.findOne({ 
        where: { userId: id }
    });

    if (!user) {
        return res.status(404).json({
            "status": "Bad request",
            "message": "User not found",
            "statusCode": 404
        });
    }

    const userData = {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
    }

    return res.status(200).json({
        "status": "success",
        "message": "User found",
        "data": userData
    })
})


const getOrgByUser = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.user;
        

        //const organisations = await Organisation.findAll({include: User});

        const organisations = await Organisation.findAll({
            include: [{
              model: User,
              where : {userId},
              attributes: []
            }],
            attributes: ['orgId', 'description', 'name']
          });


        res.status(200).json({
            "status": "success",
            "message": "Organisations found",
            "data": {
              "organisations": organisations
            }
        });
    } catch (e) {
        console.error(e);
        return res.status(404).json({
            "status": "Bad request",
            "message": "Organisations not found",
            "statusCode": 404
        });
    }
})

const getOrgById = asyncHandler(async (req, res) => {
    try {
        const {orgId} = req.params;

        // Check if user exists by searching for mail in the DB
        const org = await Organisation.findOne({ 
            attributes: ['orgId', 'name', 'description'],
            where: { orgId }
        });

        if (!org) {
            return res.status(404).json({
                "status": "Bad request",
                "message": "Organisation not found",
                "statusCode": 404
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Organisation found",
            "data": org
        })
    } catch (e) {
        console.error(e);
        res.status(404).json({
            "status": "Bad request",
            "message": "Organisation not found",
            "statusCode": 404
        });
    }
})

const createOrg = asyncHandler(async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "Client error",
                "statusCode": 400
            })
        }

        const org = await Organisation.create({name, description});

        const orgData = {
            "orgId": org.orgId,
            "name": org.name,
            "description": org.description,
        }

        await UserOrganisation.create({ 'usersId': req.user.userId, 'orgsId': orgData.orgId });
        

        return res.status(201).json({
            "status": "success",
            "message": "Organisation created successfully",
            "data": orgData
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({
            "status": "Bad Request",
            "message": "Client error",
            "statusCode": 400
        })
    }
})

const addUserToOrg = asyncHandler(async (req, res) => {
    const { userId } = req.body
    const { orgId } = req.params

    try {
        // Check if the organization exists
        const organisation = await Organisation.findByPk(orgId);
        if (!organisation) {
          return res.status(404).json({ error: 'Organisation not found' });
        }
    
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Add user to organization
        await UserOrganisation.create({ usersId: userId, orgsId: orgId });
    
        res.status(201).json({
            "status": "success",
            "message": "User added to organisation successfully",
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})


module.exports = { registerUser, loginUser, getUserById, getOrgByUser, getOrgById, createOrg, addUserToOrg };