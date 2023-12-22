const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()

const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const port= process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.bnmqd0w.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
    const User = client.db("toDoList").collection("user");
    const todolist = client.db("toDoList").collection("toDoList");


    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
    //Add user
    app.post("/adduser", async (req, res) => {
      const userInfo = req.body;
      const result = await User.findOne({email:userInfo.email});
      if(result) res.send(result);
      else
      {
        const result = await User.insertOne(userInfo);
        res.send(result);
      }
      
    });

    app.post("/addtask", async (req, res) => {
      const taskInfo = req.body;
      const result = await todolist.insertOne(taskInfo);
      res.send(result);
    });



    app.get("/tasklist", async (req, res) => {
      const userEmail = req.query.email;
      console.log(userEmail)
      const result = await todolist.find({ email: userEmail }).toArray();
      res.send(result);
    });
    //updateStatus
    app.put("/updateStatus", async (req, res) => {
      const {id,status} = req.body;
      console.log(id);
      const result = await todolist.updateOne(
        { _id: new ObjectId(id) }, // Find Data by query many time query type is "_id: id" Cheack on database
        {
          $set: { status: status }, // Set updated Data
        },
        { upsert: true } // define work
      );
      res.send({ result });
    });
    
    app.get("/check",(req,res)=>{
      res.send("Database Problem");
    })
    
  
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello');
})

app.listen(port, () => {
    console.log('Server is runding on ',port);
})


