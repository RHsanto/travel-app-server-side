var express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;
var cors = require('cors')
var app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json());

const uri = "mongodb+srv://traveling:oSjtzCdgmQPY3XOX@cluster0.wbmba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {

  try {
    await client.connect();
    const database = client.db("alldata");
    const blogCollection = database.collection("blogData");
    const offersCollection = database.collection("offersData");
    const bookingCollection = database.collection("booking");
    const usersCollection = database.collection("users")


  //ADD booking COLLECTION 
  app.get('/allBooking', async (req,res)=>{
    const cursor = bookingCollection.find({});
    const offers = await cursor.toArray();
    res.send(offers);
    })
  //ADD booking COLLECTION 
    app.post('/addBooking', async (req,res) => {
      const offer = req.body;
      const result = await bookingCollection.insertOne(offer);
      res.json( result)
    })

  //ADD Experience COLLECTION 
    app.post('/addExperience', async (req,res) => {
      const offer = req.body;
      const result = await blogCollection.insertOne(offer);
      res.json( result)
    })

    // GET API OFFERS
   app.get('/blogData', async (req,res)=>{
    const cursor = blogCollection.find({});
    const offers = await cursor.toArray();
    const count = await cursor.count()
    res.send({offers ,count});

   });
    // GET API OFFERS
   app.get('/offersData', async (req,res)=>{
    const cursor = offersCollection.find({});
    const offers = await cursor.toArray();
    res.send(offers);

   });

   // GET SINGLE BLOG
   app.get('/blogData/:id', async (req,res)=>{
     const id = req.params.id;
     const query = {_id: ObjectId(id)};
     const booking = await blogCollection.findOne(query)
   res.json(booking);
   });
   // GET SINGLE OFFERS
   app.get('/offersData/:id', async (req,res)=>{
     const id = req.params.id;
     const query = {_id: ObjectId(id)};
     const booking = await offersCollection.findOne(query)
   res.json(booking);
   });



 // Here all user  api
 app.post('/users', async (req,res) => {
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  res.json( result)
})

//Here put google login info
 app.put('/users',async (req,res)=>{
   const user = req.body;
   const filter={email:user.email};
   const options = {upsert : true};
   const updateDoc = {$set : user};
   const result = usersCollection.updateOne(filter,updateDoc,options);
   res.json(result)
 })

//Here put make admin  info
 app.put('/users/admin',async (req,res)=>{
   const user = req.body;
   const filter={email:user.email};
   const updateDoc = {$set :{role : 'admin'}};
   const result = await usersCollection.updateOne(filter,updateDoc);
   res.json(result)
 })

// here admin   api
app.get('/users/:email', async (req,res) => {
  const email = req.params.email;
  const query = {email:email};
  const user = await usersCollection.findOne(query);
  let isAdmin = false;
  if(user?.role === 'admin'){
    isAdmin = true;
  }
  res.json( {admin:isAdmin})
})


    // GET API ORDERS
    app.get('/users', async (req,res)=>{
      const cursor = usersCollection.find({})
      const orders = await cursor.toArray();
      res.send(orders);

     });

      //DELETE API ORDERS
    app.delete('/allBooking/:id', async(req,res)=>{
      const id     = req.params.id;
      const query  = {_id:ObjectId(id)} ;
      const result = await bookingCollection.deleteOne(query)
      res.json(result);
     })

     // UPDATE STATUS 
     app.put('/allBooking/:id', async(req,res)=>{
       const id = req.params.id;
       const filter ={_id: ObjectId(id)}
       const option = {upsert : true};
       const updateStatus ={
         $set:{
           status: 'Approved',
         },
       };

       const result = await bookingCollection.updateOne(filter,updateStatus,option);
       res.json(result)
     })

    // GET LOGGED USER ORDERS
    app.get('/allBooking/:email', async (req,res)=>{
      const result = await bookingCollection.find({email: req.params.email}).toArray();
      res.json(result)
    })

   
  } finally {
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
  res.send('Running My Tourism Side database ')
})



app.listen(port,()=>{
  console.log('Running Server on port',port);
})
