const express = require('express');
const app = express();
const collection1 = require('./db1')
const collection2 = require('./db2')
const collection3 = require('./db3')
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.get('/',async(req,res)=>{
    const data = await collection1.find();
    res.json(data)
 });
app.post('/',async (req,res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const data = new collection1({
        name:name,email:email,password:password   
        });
        const result = await data.save();
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json({error:error.message})
    }
   });
   app.post('/login',async (req,res) => {
    const email = req.body.email;
    const password = req.body.password
    try {
        const data = await collection1.findOne({email});
        if(data.email==email){
            if(data.password==password){
                res.status(200).json(data)
                console.log('true')
               
            }
        }
    } catch (error) {
        res.status(401).json({error:error.message})
    }
   })

   
  app.get('/userprofile/:email',async (req,res) => {
    try {
      const email = req.params.email;
      const data = await collection1.findOne({email});
      res.status(201).json(data)
    } catch (error) {
      res.status(401).json(error)
    }
  }
  )

  app.post('/cart',async (req,res) => {
    try {
        const productName = req.body.productName;
        const email = req.body.email;
        const productPrice = req.body.productPrice;
        const data = new collection2({
        productName:productName,email:email,productPrice:productPrice 
        });
        const result = await data.save();
        res.status(200).json(result)
    } catch (error) {
        res.status(401).json({error:error.message})
    }
   });

   app.get('/cart/:email',async(req,res)=>{
    const email = req.params.email
    const data = await collection2.find({email:email})
    try {
        if(data){
            res.status(200).json(data)
           } 
    } catch (error) {
        res.status(401).json("not found")
    }
   });

   app.delete('/cart/:email/item/:id', async (req, res) => {
    const email = req.params.email;
    const _id = req.params.id;

    try {
        // Find the cart item by both email and _id
        const data = await collection2.findOneAndDelete({ _id, email });

        if (data) {
            res.status(200).json(data); // Return the deleted item
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting item' });
    }
});

app.post('/orders',async (req,res) => {
    try {
        const email = req.body.email;
        const cartitems = req.body.cartitems;
        const address = req.body.address;
        const data = new collection3({
            email,cartitems,address
        });
        const result = await data.save();
        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ message: 'Error ' });
    }
});

app.delete('/delete/:email', async (req, res) => {
    try {
      const email = req.params.email;
      
      // Use deleteMany to remove all documents with the matching email
      const data = await collection2.deleteMany({ email });
  
      if (data.deletedCount === 0) {
        return res.status(404).json({ message: 'No records found with the given email' });
      }
  
      res.status(200).json({ message: `${data.deletedCount} records deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting records' });
    }
  });

  app.get('/orders/:email', async (req, res) => {
    try {
        const email = req.params.email;
        
        // Find all orders that match the email
        const data = await collection3.find({ email });
        
        if (data.length === 0) {
            return res.status(404).json({ message: 'No orders found for this email' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Error retrieving orders:", error); // Log error for debugging
        res.status(500).json({ message: 'Error retrieving records' });
    }
});
  app.delete('/orders/:id',async (req,res) => {
    try {
        const _id = req.params.id;
        const data = await collection3.findByIdAndDelete({_id});
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'not cancelled' });
    }

  });


  app.patch('/updateprofile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { name, password } = req.body;
        
        // Prepare data to update
        const updateData = { name };
        if (password) {
            updateData.password = password; // Directly assign password
        }

        // Update user profile in the database
        const updatedUser = await collection1.findOneAndUpdate(
            { email: email }, // Find user by email
            { $set: updateData }, // Set the updated name and password (if provided)
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return success response along with the updated user data (if needed)
        res.json({ 
            message: 'Profile updated successfully', 
            user: updatedUser.value // Access the updated user document
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});
app.get('/allorders',async(req,res)=>{
    const data = await collection3.find();
    try {
        if(data){
            res.status(200).json(data);    
        }
       
    } catch (error) {
        res.status(500).json({ message: 'not cancelled' });  
    }
   
})

// Assuming Express and Mongoose setup

// PUT request to update order status
app.put('/orders/:orderId/status', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
  
    try {
      const order = await collection3.findById(orderId);
      if (!order) {
        return res.status(404).send('Order not found');
      }
  
      order.status = status; // Update status
      await order.save();
  
      res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating order status' });
    }
  });
  app.delete('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const result = await collection1.findByIdAndDelete(userId);
  
      if (!result) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
   app.listen(3000)