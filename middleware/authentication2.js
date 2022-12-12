const User = require("../model/userSchema");

const authentication2= async (req,res,next)=>{
  try {
    
    //const token = req.rawHeaders.cookies.jwtoken;
    console.log(req.cookies.jwtoken);
    next();
    
  } catch (e) {console.log(e);
    res.status(401).send("Unauthorised No token provided");
  }
}
module.exports = authentication2;
