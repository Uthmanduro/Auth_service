const asyncHandler = require('express-async-handler');
const User = require('./models/user.js');
const Organization = require('./models/organisation.js');
const UserOrganization = require('./models/userOrganization.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    // Do not save confirmPassword to the database
    this.confirmPassword = undefined; // Clear confirmPassword field after hashing
    next();
  } catch (error) {
    next(error);
  }



const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    console.log('Received request with body:', req.body)

    // Validation request
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
    console.log('validation failed, please fill all fields')
    res.status(400);
    throw new Error("Please fill in all required fields");
    }
    console.log('Validation Successful')
    //Validate the length of the password
    if (password.length < 8) {
    res.status(400);
    throw new Error("Password must be up to 8 characters");
    }

    // Check if user email or phone number already exists
    const userExists = await User.findOne
    ({ 
        $or: [
        { email }, 
        { phoneNumber }
        ] 
    });

    if (userExists) {
    res.status(400);
    throw new Error("User already exists. Please login!");
    }

    // Create new user with the provided role
    const user = await User.create({
    firstName,
    lastName,
    phoneNumber,
    email,
    password,
    confirmPassword,
    role,
    });

    //   Generate Token
    const token = generateToken(user._id, user.role);

    // Send HTTP-only cookie
    res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
    });

    if (user) {
    const { 
        _id, 
        firstName, 
        lastName, 
        phoneNumber, 
        email, 
        photo, 
        bio,
        role,
    } = user;
    res.status(201).json({
        _id,
        firstName,
        lastName,
        phoneNumber,
        email,
        photo,
        bio,
        role,
        token,
    });
    } else {
    res.status(400);
    throw new Error("Invalid user data");
    }
});