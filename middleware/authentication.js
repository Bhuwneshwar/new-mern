const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");


const authentication = async(req, res, next)=> {
  try {
    const token = req.cookies.jwtoken;
    console.log(token);
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const rootUser = await User.findOne({
      _id: verifyToken._id, "tokens.token": token
    });
    if (!rootUser) {
      throw new Error("User not found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).send("Unauthorised No token provided");
  
  }
}
module.exports = authentication;