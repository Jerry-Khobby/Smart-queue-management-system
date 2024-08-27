const User = require("../models/user");
const Medicine = require("../models/medicine");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");





const secret = process.env.JWT_SECRET;
// there is a middleware for jwt validation token 
// JWT validation middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const tokenParts = token.split(' ');
  if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
      return res.status(401).json({ error: 'Unauthorized: Malformed token' });
  }

  jwt.verify(tokenParts[1], secret, (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      req.userId = decoded.id; // Add user ID to request object
      next();
  });
};

// controller for the creating user  
const createUser=async(req,res)=>{
  const {password,name,email}=req.body;
  if(!password||!name||!email){
    return res.status(400).json({error:'All fields are required'});
  }
  try{
    const existingUser = await User.findOne({email});
    if(existingUser){
      console.log("User already exist");
      return res.status(409).json({error:' User with this email already exist'})
    }
    const hashedPassword = await bcrypt.hash(password,10);

    // move on to create the user
    const newUser= new User({
      name:name,
      password:hashedPassword,
      email:email,
    });
    await newUser.save();
    //generate a jwt 
    const token=jwt.sign({id:newUser._id},secret,{expiresIn:'5d'});
    res.status(200).json({token});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Internal server error'});
  }
}


const login= async(req,res)=>{
const {email,password}=req.body;
if(!email||!password){
  return res.status(400).json({error:'All fields are required'});
}
// try and check for the user 
try{


const user = await User.findOne({email:email});
if(!user){
  return res.status(401).json({error:'Invalid credentials'});
}
// compare the passwords 
const passwordmatch = await bcrypt.compare(password,user.password);
if(!passwordmatch){
  return res.status(401).json({error:'Invalid credentials'});
}

 const token =jwt.sign({id: user._id },secret,{expiresIn:'5d'});
res.status(200).json({token});

}catch(error){
  res.status(500).json({ error: 'Internal server error' });
}
}


const addmedicine=async(req,res)=>{
const {name,medicineGroup,description}=req.body;
if(!name || !medicineGroup || !description){
  return res.status(401).json({error:'All fields are required'});
}
try{
  const user = await User.findById(req.userId);
  if(!user){
    return res.status(404).json({message:'User not found'});
  }
  const medicine = new Medicine({
    name:name,
    description:description,
    medicineGroup:medicineGroup,
    owner:user._id,
  
  });

  await medicine.save();
res.status(201).json({ message: 'Medicine saved successfully' });
}catch(error){
  res.status(500).json({ message: error.message });
}
}



// I want to get all the medicine belonging to a particular user 
const usersdrugs=async(req,res)=>{
  


}


module.exports={
  createUser,
  login,
  addmedicine:[verifyToken,addmedicine],
  usersdrugs:[verifyToken,usersdrugs],
}