const express= require("express");
const mongoose= require("mongoose");
const cors= require("cors");
const path= require("path");
const cookieParser= require("cookie-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});
require("./Db/conn");
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = process.env.PORT;
//middleware
app.use(require("./router/auth"));

const middleware = (req,res,next)=>{
  console.log("middleware checked");
  next();
}

app.use(express.static(path.join(__dirname,"./build")));
app.get("*", async (req,res)=>{
  res.sendFile(path.join(__dirname,"build/index.html"))
})

app.listen(port,async()=>{
  console.log("server is running at port "+port);
});