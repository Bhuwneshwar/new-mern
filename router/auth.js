const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authentication = require("../middleware/authentication");
//const authentication2 = require("../middleware/authentication2");

require("../Db/conn");
router.use(express.json());
router.use(cors());
const User = require("../model/userSchema");



router.post("/api/register", async (req, res)=> {
  const {
    name, email, phone, work, password, cpassword
  } = req.body;
  console.log(req.body);
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({
      message: "please fill all the field"
    });
  }
  if (password === cpassword) {} else {
    return res.send({
      message: "password and confirm password not matching."
    });
  }
  try {
    const f = await User.findOne({
      email: email
    });
    if (f) {
      console.log(f);
      return res.json({
        message: "this Email already registered."
      });
    }

    const user = new User({
      name, phone, email, work, password, cpassword
    });
    const saved = await user.save();
    if (saved) {
      res.status(201).json({
        message: "data inserted "
      });
    }

  } catch (e) {
    console.log(e)}
});
router.post("/api/login", async(req, res)=> {
  const {
    email,
    password
  } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "please fill all the field"
    });
  }
  try {
    const f = await User.findOne({
      email: email
    });
    if (!f) {
      console.log(f);
      return res.json({
        message: "this Email not registered."
      });
    }
    const isMatch = await bcrypt.compare(password, f.password);
    if (isMatch) {
      const token = await f.generateAuthToken();
      console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now()+25892000000),
        http: true
      }).status(200).send({
        message: "login successfully."
      });
    } else {
      return res.json({
        message: "Invalid login details."
      });
    }

  } catch (e) {
    console.log(e)}
});
router.get("/api/about", authentication, (req, res)=> {
  console.log("Hello i about");
  res.send(req.rootUser);

});
router.get("/api/logout", authentication, (req, res)=> {
  console.log("Hello i logout");
  res.clearCookie("jwtoken",{path:"/"}).status(200).send("logout");

});
router.get("/api/getdata", authentication, (req, res)=> {
  console.log("Hello i contact");
  res.send(req.rootUser);

});
router.post("/api/contact", authentication, async (req, res)=> {
  try {
    const {
      name,
      email,
      phone,
      message
    } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("all fields are required");
      return res.send({
        message: "all fields are required"
      });
    }
    const userContact = await User.findOne({
      _id: req.userId
    });
    if (userContact) {
      const userMessage = await userContact.addMessage(name, email, phone, message);
      await userContact.save();
      res.status(201).send({
        message: "User contacts successfully"
      });
    }


  } catch (e) {
    console.log(e);
  }

});
module.exports = router;
