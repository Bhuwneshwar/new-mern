const express= require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../Db/conn");
router.use(express.json());
const User = require("../model/userSchema");

router.get("/", (req,res)=>{
  res.send("test root server ");
});
router.post("/register",async(req,res)=>{
  const {name,email,phone,work, password,cpassword}=req.body;
  if (!name|| !email|| !phone|| !work|| !password|| !cpassword) {
   return res.status(422).send("please fill all the field");
  }
  if(password!==cpassword){
     return res.status(422).send("password and confirm password not matching.");
   }
  try {
    const f = await  User.findOne({email:email});
    if (f) {
    console.log(f);
     return res.json({message:"this Email already registered."});
    }
  
    const user = new User({name,phone,email,work, password,cpassword});
    const saved = await user.save();
    if (saved) {
      res.status(201).send("data inserted ");
    }
      
  } catch (e) {console.log(e)}
});
router.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  if ( !email || !password) {
   return res.status(400).send("please fill all the field");
  }
  try {
    const f = await  User.findOne({email:email});
    if (!f) {
      console.log(f);
     return res.json({message:"this Email not registered."});
    }
    const isMatch = await bcrypt.compare(password,f.password);
    if (isMatch) {
      const token = await f.generateAuthToken();
      console.log(token);
      res.cookie("jwtoken",token,{
        expires:new Date(Date.now()+25892000000),
        http :true
      });
      res.json({message:"login successfully."});
    }else{
     return res.json({message:"Invalid login details."});
    }
      
  
    
      
  } catch (e) {console.log(e)}
});

module.exports = router;