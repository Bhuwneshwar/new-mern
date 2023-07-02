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
 router.post("/api/trade/alarm",async (req, res)=> {
  
try {
    console.log(req.body);

    let content = req.body.info;
    let now = req.body.now;

    content = content.replace(/ nextLine /g, "\n");
    const currencyRegex = /[Oo]perating [Cc]urrency: \s?\s?[A-Z]{2,5}/gi;
    const coinRegex = /[A-Z]{2,5}/g;
    const BuyRegex =
      /[Bb]uy\s? [Tt]ime\s?\s?\s?:?\s?\s?\s?:?\s?\s?\s?(\d{1,2}:\d{2} [AP]M)/gi;
    const BuyRegex_a = /(\d{1,2}:\d{2} [AP]M)/;
    const SellRegex =
      /[Ss]ell\s? [Tt]ime\s?\s?\s?:?\s?\s?\s?:?\s?\s?\s?(\d{1,2}:\d{2} [AP]M)/gi;
    const SellRegex_a = /(\d{1,2}:\d{2} [AP]M)/;

    const currency = content.match(currencyRegex);
    console.log("currency", currency);
    const buy_times = content.match(BuyRegex);
    console.log(buy_times);
    buyArray = [];
    buy_times.forEach((time) => buyArray.push(time.match(BuyRegex_a)[0]));
    console.log("buyArray", buyArray);
    const sell_times = content.match(SellRegex);
    console.log(sell_times);

    sellArray = [];
    sell_times.forEach((time) => sellArray.push(time.match(SellRegex_a)[0]));

    // Create a new Date object with the current date
    var currentDate = new Date();
    // Get the day, month, and year
    var day = currentDate.getDate(); // Returns the day of the month (1-31)
    var month = currentDate.getMonth() + 1; // Returns the month (0-11), so we add 1
    //var monthName = currentDate.toLocaleString("default", { month: "long" });

    var year = currentDate.getFullYear(); // Returns the year (e.g., 2023)

    // Output the results
    console.log("Day: " + day);
    console.log("Month: " + month);
    console.log("Year: " + year);
    const dt = month + " " + day + " " + year;
    console.log(dt);

    let BuyTimes = [];
    buyArray.forEach((time) => {
      console.log(time);
      let foundTime = new Date(time + " " + dt);
      let timey =
        foundTime.getHours() +
        ":" +
        foundTime.getMinutes() +
        ":" +
        foundTime.getSeconds();

      console.log("timey", timey);
      console.log("found date", foundTime);
      const miliDef = foundTime.getTime() - now * 1000;
      console.log("miliDef", miliDef);

      if (miliDef > 0) {
        let secondDef = Math.floor(miliDef / 1000) - 65;
        console.log(secondDef);

        BuyTimes.push(secondDef);
      } else {
        //  res.send("It is old date");
      }
    });

    let SellTimes = [];

    sellArray.forEach((time) => {
      let foundTime = new Date(time + " " + dt);

      console.log(Date(time + " " + dt));
      console.log(time + " " + dt);
      let miliDef = foundTime.getTime() - now * 1000;
      console.log(miliDef);
      if (miliDef > 0) {
        let secondDef = Math.floor(miliDef / 1000) - 65;
        console.log(secondDef);

        SellTimes.push(secondDef);
      } else {
        //return res.send("It is old date");
      }
    });
    let currencies = [];
    currency.forEach((cucy) => {
      currencies.push(cucy.match(coinRegex));
    });
    let responses = {
      currencies,

      SellDueTimes: SellTimes,
      BuyDueTimes: BuyTimes,

      SellTimes: sellArray,
      BuyTimes: buyArray,
    };
    console.log(responses);
    return res.send(responses);
    
  } catch (e) {
    console.log(e);
        }
 }

    
module.exports = router;
