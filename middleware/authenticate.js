const jwt = require('jsonwebtoken')
require('cookie-parser')
const Login = require("../models/logSchema")

const Authenticate = async (req, res, next) => {
    const token = req.cookies.jwtoken;
    if (!token) {
        return res.status(401).send("A token is required for authentication");
    }
    try {
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await Login.findOne({ _id: verifyToken._id , "tokens.token" : token});

        if(!rootUser){ throw new Error('User not found')}

        req.token = token;
        req.user = verifyToken;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    } catch (err) {
        res.status(401).send('Unauthorized: No token provided')
        console.log(err);
    }
}

module.exports = Authenticate