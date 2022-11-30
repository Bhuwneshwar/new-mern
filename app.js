const express= require("express");
const mongoose= require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});
require("./Db/conn");
app.use(express.json());

const port = process.env.PORT;
//middleware
app.use(require("./router/auth"));

const middleware = (req,res,next)=>{
  console.log("middleware checked");
  next();
}



app.listen(port,()=>{
  console.log("server is running at port "+port);
});