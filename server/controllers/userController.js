const User = require("../models/user");
const Patient = require("../models/patient");
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
  const {password,name,email,role,contactNumber,department,profileImage}=req.body;
  if(!password||!name||!email ||!role ||!department||!contactNumber){
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
      role:role,
      contactNumber:contactNumber,
      department:department,
      profileImage:profileImage,
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


const sendPatientsDetails = async (req, res) => {
  const { name, insuranceNumber, age, gender, address, phone, symptoms, diseaseDescription, queueNumber, diseaseStartDate } = req.body;
  
  // Validate required fields
  if (!name || !insuranceNumber || !age || !gender || !address || !phone || !symptoms || !diseaseDescription || !queueNumber || !diseaseStartDate) {
    return res.status(401).json({ error: 'All fields are required' });
  }
  
  try {
    // Find the user who is recording the patient details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create a new patient record
    const patient = new Patient({
      name: name,
      insuranceNumber: insuranceNumber,
      age: age,
      gender: gender,
      address: address,
      phone: phone,
      symptoms: symptoms,
      diseaseDescription: diseaseDescription,
      queueNumber: queueNumber,
      diseaseStartDate: diseaseStartDate,
      filled_in: user._id, // Reference to the user who filled in the details
    });

    // Save the patient record to the database
    await patient.save();
    
    // Respond with success message
    res.status(201).json({ message: 'Patient details saved successfully' });
    
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ message: error.message });
  }
};

// I want to get all the medicine belonging to a particular user 


const allPatients = async (req,res)=>{
  try{
    const allPatients = await Patient.find().sort({queueNumber:1});
    if(!allPatients.length){
      console.log("There is no Patient around");
      return res.status(404).json({message:'No medicine available'});
    }
    res.status(200).json(allPatients);
  }catch(err){
console.error(err);
return res.status(404).json({error:'There was an error'});
  }
}

// edit the data for a particular for that day 
const updatePatients = async (req, res) => {
  const { insuranceNumber } = req.params;
  const updates = req.body; // The fields you want to update
  
  try {
    // Fetch the patient record by insuranceNumber
    const patient = await Patient.findOne({ insuranceNumber });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check if the recordingDate is today
    const today = new Date().setHours(0, 0, 0, 0); // Start of today
    const recordingDate = new Date(patient.recordingDate).setHours(0, 0, 0, 0); // Start of the recording date
    
    if (today !== recordingDate) {
      return res.status(403).json({ message: 'You can only update records for today.' });
    }
    
      // Remove insuranceNumber from updates if it exists
      if (updates.insuranceNumber) {
        delete updates.insuranceNumber;
        return res.status(405).json({error:'Health Insurance Number cannot be updated'});
      }
    // If the recordingDate is today, update the patient record
    Object.keys(updates).forEach(key => {
      patient[key] = updates[key];
    });
    
    await patient.save();
    
    res.status(200).json({ message: 'Patient record updated successfully', patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'There was an error updating the patient record' });
  }
};


const getSinglePatient = async (req, res) => {
  const { insuranceNumber } = req.params;
  try {
    // Use findOne to search for a single patient with the matching insurance number
    const singlePatient = await Patient.findOne({ insuranceNumber });
    
    // If no patient is found, return a 404 error
    if (!singlePatient) {
      return res.status(404).json({ message: 'No data available' });
    }
    
    // If the patient is found, return the patient data
    res.status(200).json({ singlePatient });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'There was an error' });
  }
};











const usersdrugs=async(req,res)=>{
  try{
const usersMedicine = await Medicine.find({owner:req.userId});
if(!usersMedicine.length){
console.log("There is no medicine in the database for you");
return res.status(404).json({message:'No medicine available'});
}
res.status(201).json({usersMedicine});
  }catch(error){
console.log(error);
return res.status(404).json({error:'There was an error'});
  }

}


module.exports={
  createUser,
  login,
  sendPatientsDetails:[verifyToken,sendPatientsDetails],
  allPatients:[verifyToken,allPatients],
  getSinglePatient:[verifyToken,getSinglePatient],
  updatePatients:[verifyToken,updatePatients],

}