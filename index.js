const express = require('express') // importing express
var cors = require('cors');
const app = express() // initialize express
const port = 3000 //setting the port 
const mongoose = require('mongoose');
const { Schema } = mongoose; // Grab the schema object from mongoose
require('dotenv').config()

app.use(cors())
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.awx9j.mongodb.net/netflix-db?retryWrites=true&w=majority`, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const User = mongoose.model('Users', new Schema(
  { 
    name: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }
));



// using the get method
// LOGIC for the Get Request
// I'm trying to get data
app.get('/', (req, res) => {
  res.send("Hellow World")
})

app.post('/register', (req, res)=>{
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  newUser.save((err, user)=>{
    if(err){
      console.log(err);
      res.send(400, {
        status: err
      })
    } else {
        res.send({
          status: "registered"
        })
    }
  })
  
})

app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  User.findOne({ email: email, password: password }, (err, user)=>{
    console.log(user);
    if(user){
      res.send({
        status: "valid",
        token: user.id
      });
    } else {
      res.status(404).send("not valid") 
    }
  })
})

// start our app
// listening to the port 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
