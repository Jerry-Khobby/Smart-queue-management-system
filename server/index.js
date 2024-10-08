const express= require("express");
const app=express();

const bodyParser=require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv=require("dotenv").config();
const route = require("./routes/route");
const cookieParser = require('cookie-parser')
const MongoStore = require("connect-mongo");


// defining all the middlewares 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// I want to use the sessions 
app.use(session({
  secret:"Your secret key",
  saveUninitialized: true,
  resave:false,
  store:MongoStore.create({
    mongoUrl:process.env.MONGO_URI,
  }),
  cookie:{
    maxAge:1000*60*60*24, // 1 day 
  }
}));



app.use(cors());




const URI =process.env.MONGO_URI;

mongoose.connect(URI);
 const database=mongoose.connection;

 database.on("error",(error)=>{
  console.error("MongoDb connection error: ",error);
 });
 database.once("open",()=>{
  console.log("Connected to MongoDB");
 })




// defining the routes. 
app.use(route);





const port_number=process.env.PORT ||5000;
app.listen(port_number,()=>{
  console.log(`The server is listening successfully on ${port_number}`);
})

