const mongoose= require("mongoose");
const DB = process.env.DATABASE;
mongoose.connect(DB).then((s)=>{
  console.log("connection successful "+s);
  
}).catch((e)=>{
  console.log("not connection "+e);
  
});