const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://hiteshnagpal:Hunnynagpal%402006@cluster0.jzero.mongodb.net/E-commerce?retryWrites=true&w=majority").then(()=>{
    console.log("db success")
}).catch((e)=>{
    console.log(e)
});

const schema = new mongoose.Schema({
  productName:{
    type:String
  },
  productPrice:{
    type:Number
  },
  email:{
    type:String
  },
  
});

const collection2 = new mongoose.model("collection2",schema)
module.exports = collection2;