const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://hiteshnagpal:Hunnynagpal%402006@cluster0.jzero.mongodb.net/E-commerce?retryWrites=true&w=majority").then(()=>{
    console.log("db success")
}).catch((e)=>{
    console.log(e)
});
  const cartItemSchema = new mongoose.Schema({
    productName: String,
    productPrice: Number,
    quantity: { type: Number, default: 1 }, // Quantity field with default value
  });
  
  // Define the Order schema
  const schema = new mongoose.Schema({
    email: { type: String, required: true }, // Email of the customer
    address: { type: String, required: true }, // Delivery address
    cartitems: [cartItemSchema], // Array of cart items
    status: { type: String, default: 'Pending' }, // New field for order status
  }, { timestamps: true }); 


const collection3 = mongoose.model("collection3", schema);
module.exports = collection3;
