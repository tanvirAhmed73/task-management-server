const express = require ('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());


const { MongoClient,ObjectId , ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q1fcrjh.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    const taskManagement = client.db('task-management').collection('createTask');

    app.get('/createTask', async(req,res) =>{
        const result = await taskManagement.find().toArray();
        res.send(result)
    })

    app.get('/createTask/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await taskManagement.findOne(query);
        res.send(result);
      })

    app.post('/createTask', async (req, res) => {
        const item = req.body;
        const result = await taskManagement.insertOne(item);
        res.send(result);
      });

    // update pet item by admin
    app.patch('/createTask/:id', async (req, res) => {
        const item = req.body;
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const updatedDoc = {
          $set: {
            titles: item.titles,
            deadlines: item.deadlines,
            description: item.description,
            priority: item.priority,
            currentUser: item.currentUser,
            todo: item.toDo,
            
            
            
          }
        }
        
        const result = await taskManagement.updateOne(filter, updatedDoc)
        res.send(result);
      })

    

    // delete toDo item 
    app.delete('/createTask/:id',async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id)}
        const result = await taskManagement.deleteOne(query);
        res.send(result);
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send("running")
})

app.listen(port, ()=>{
    console.log(`running ${port}`)
})