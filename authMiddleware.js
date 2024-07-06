const asyncHandler = require("express-async-handler");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.sendStatus(401);

        // using jwt to get token
        // const token = req.cookies.token;
        // if (!token) {
        //   res.status(401);
        //   throw new Error("Not authorized, please login");
        // }

        // Verify Token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Get user id from token
        const user = await User.findOne({ 
            where: { userId: verified.id }
        });

        if (!user) {
            return res.status(401).json({
                "status": "Bad request",
                "message": "Authentication failed",
                "statusCode": 401
            });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            "status": "Bad request",
            "message": "Authentication failed",
            "statusCode": 401
        });
    }
});


module.exports = protect ;