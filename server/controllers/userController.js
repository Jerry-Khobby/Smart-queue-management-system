const User = require("../models/user");
const Patient = require("../models/patient");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Medication = require("../models/medicine");
const Blacklist =require("../models/blacklist");





const secret = process.env.JWT_SECRET;
// there is a middleware for jwt validation token 
// JWT validation middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]; // Retrieve token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const tokenParts = token.split(' '); // Correct splitting by space

  if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
  }

  const actualToken = tokenParts[1]; // Get the actual token part

  try {
    // Check if the token is blacklisted
    const isBlacklisted = await Blacklist.findOne({ token: actualToken });
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Unauthorized: Token has been invalidated' });
    }

    // Verify the token
    const decoded = jwt.verify(actualToken, secret); // Use await here
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user; // Attach the user object to request
    req.userId = decoded.id; // Add user ID to request object
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Token verification failed' });
  }
};






// controller for the creating user  
// In your backend function
const createUser = async (req, res) => {
  const { password, name, email, role, contactNumber, department, profileImage } = req.body;
  if (!password || !name || !email || !role || !department || !contactNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      name: name,
      password: hashedPassword,
      email: email,
      role: role,
      contactNumber: contactNumber,
      department: department,
      profileImage: profileImage,
    });
    await newUser.save();

    // Generate a JWT
    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: '1d' });
    res.status(200).json({ message: 'Signup successful', token: token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



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

 const token =jwt.sign({id: user._id },secret,{expiresIn:'1d'});
res.status(200).json({message:'Login successful',token: token});

}catch(error){
  res.status(500).json({ error: 'Internal server error' });
}
}

const sendPatientsDetails = async (req, res) => {
  try {
    // Destructure the data coming from the frontend
    const { 
      name, 
      insuranceNumber, 
      age, 
      gender, 
      address, 
      phone, 
      symptoms, 
      diseaseDescription, 
      queueNumber, 
      diseaseStartDate,
    } = req.body;

    // Parse fields that should be integers
    const parsedInsuranceNumber = parseInt(insuranceNumber, 10);
    const parsedAge = parseInt(age, 10);
    const parsedQueueNumber = parseInt(queueNumber, 10);

    // Validate the parsed fields
    if (isNaN(parsedInsuranceNumber) || parsedInsuranceNumber.toString().length !== 8) {
      return res.status(400).json({ error: "Insurance number must be 8 digits and a valid number." });
    }

    if (isNaN(phone) || phone.toString().length !== 10) {
      return res.status(400).json({ error: "Phone number must be 10 digits." });
    }

    if (isNaN(parsedAge)) {
      return res.status(400).json({ error: "Age must be a valid integer." });
    }

    if (isNaN(parsedQueueNumber)) {
      return res.status(400).json({ error: "Queue number must be a valid integer." });
    }

    // Use the current date as a Date object
    const today = new Date();  // Automatically captures the correct date

    // Check if the queue number exists for today's date
    const existingQueue = await Patient.findOne({
      queueNumber: parsedQueueNumber,
      recordingDate: today, // This should work as Mongoose can handle Date objects
    });

    if (existingQueue) {
      return res.status(400).json({ error: "Queue number already exists for today." });
    }

    // Save the patient details
    const patient = new Patient({
      name,
      insuranceNumber: parsedInsuranceNumber,
      age: parsedAge,
      gender,
      address,
      phone,
      symptoms,
      diseaseDescription,
      queueNumber: parsedQueueNumber,
      diseaseStartDate: new Date(diseaseStartDate),  // Ensure diseaseStartDate is also a valid Date object
      recordingDate: today,  // Use the current date
      filled_in: req.userId,
    });

    await patient.save();

    // Respond with success
    return res.status(201).json({ message: "Patient details saved successfully!" });
  } catch (error) {
    console.error("Error saving patient details:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};







// I want to get all the medicine belonging to a particular user 


const allPatients = async (req,res)=>{
  try{
    const allPatients = await Patient.find().sort({queueNumber:1,recordingDate:1});
    if(!allPatients.length){
      console.log("There is no Patient around");
      return res.status(404).json({message:'No Patient available in the database'});
    }
    res.status(200).json(allPatients);
  }catch(err){
console.error(err);
return res.status(404).json({error:'There was an error'});
  }
}

// edit the data for a particular for that day 
// any time you use the useParams, you have to check for it availability and all that 
const updatePatients = async (req, res) => {
  const { insuranceNumber } = req.params;

  if (!insuranceNumber || isNaN(insuranceNumber)) {
    console.log("Insurance number cannot be found")
    return res.status(400).json({ message: 'Invalid or missing insurance number' });
  }
  const updates = req.body;
  
  try {
    const patient = await Patient.findOne({ insuranceNumber });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
    const recordingDate = new Date(patient.recordingDate).toISOString().split('T')[0]; // Get recording date in 'YYYY-MM-DD' format
    
    if (today !== recordingDate) {
      console.log(`Today: ${today}, Recording Date: ${recordingDate}`);
      return res.status(403).json({ message: 'You can only update records for today.' });
    }
    


    if (updates.insuranceNumber) {
      return res.status(405).json({ message: 'Health Insurance Number cannot be updated' });
    }

    Object.keys(updates).forEach(key => {
      patient[key] = updates[key];
    });

    await patient.save();
    
    res.status(200).json({ message: 'Patient record updated successfully', patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'There was an error updating the patient record' });
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



// Now when the doctor receives this, the doctor will prescribe the drugs for the patient 
const prescribeMedication = async (req, res) => {
  const { insuranceNumber } = req.params;
  const medications = req.body.medications;

  if (!insuranceNumber || isNaN(insuranceNumber)) {
    return res.status(400).json({ message: 'Invalid or missing insurance number' });
  }



  if(!req.user || req.user.role !=='doctor'){
    return res.status(403).json({ message: 'You are not authorized. Only doctors can prescribe medications.' });
  }

  if (!Array.isArray(medications) || medications.length === 0) {
    return res.status(400).json({ message: 'No medications provided' });
  }

  try {
    const patient = await Patient.findOne({ insuranceNumber });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const medicationRecords = [];

    for (const med of medications) {
      const { drugName, dosage, frequency } = med;

      // Validate fields
      if (!drugName || !dosage || !frequency) {
        return res.status(400).json({ message: 'All medication fields (drugName, dosage, frequency) are required' });
      }

      const medication = new Medication({
        drugName,
        dosage,
        frequency,
        prescribedBy: req.userId,
        patient: patient._id,
      });

      await medication.save();
      medicationRecords.push(medication._id);
    }

    patient.medications.push(...medicationRecords);
    await patient.save();

    res.status(201).json({ message: "Medications prescribed successfully", medications: medicationRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error prescribing the medications" });
  }
};



// I have to create a get route for this , 
const getDrugsPrescribed = async (req, res) => {
  const { insuranceNumber } = req.params;

  // Check if the insuranceNumber is valid
  if (!insuranceNumber || isNaN(insuranceNumber)) {
    return res.status(400).json({ message: 'Invalid or missing insurance number' });
  }

  // Get today's date at the start (00:00:00) and the end of the day (23:59:59)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0); // Set to start of the day
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999); // Set to end of the day

  try {
    // Find the patient by insurance number
    const patient = await Patient.findOne({ insuranceNumber });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Query the Medication model to find drugs prescribed today
    const prescribedDrugs = await Medication.find({
      patient: patient._id,
      status: "Prescribed",
      createdAt: { 
        $gte: startOfDay,  // Start of today
        $lte: endOfDay     // End of today
      }
    });

    // If no drugs were prescribed today, return an appropriate response
    if (!prescribedDrugs.length) {
      return res.status(404).json({ message: "No drugs prescribed to this patient today" });
    }

    // Return the list of prescribed drugs
    return res.status(200).json({ message: "Drugs prescribed today", prescribedDrugs });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while retrieving prescribed drugs" });
  }
};








// the pharmacist portion of things 
const donePrescription = async (req, res) => {
  const { insuranceNumber } = req.params;
  const { status, dispensedDate } = req.body;

  if (!insuranceNumber || isNaN(insuranceNumber)) {
    return res.status(400).json({ message: 'Invalid or missing insurance number' });
  }
  
  if (!req.user || req.user.role !== 'pharmacist') {
    return res.status(403).json({ message: 'You are not authorized. Only pharmacist can prescribe medications.' });
  }
  
  // Catch-all error handling

  try {
    // Find the patient by insuranceNumber
    const patient = await Patient.findOne({ insuranceNumber });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    // Find the medication record for the patient that needs to be updated
    const medication = await Medication.findOne({ patient: patient._id, status: "Prescribed" });
    if (!medication) {
      return res.status(404).json({ message: "No prescribed medication found for this patient" });
    }

    // Update the medication record with pharmacist's details
    medication.status = status || "Dispensed";  // Set status to "Dispensed" by default
    medication.dispensedDate = dispensedDate || new Date();  // Use current date if not provided
    medication.dispensedBy = req.userId;  // Assuming the pharmacist's ID is stored in req.userId

    // Save the updated medication record
    await medication.save();

    // Optionally, update the patient's record to mark the prescription process as complete
    patient.prescriptionComplete = true;
    console.log("It is done")
    await patient.save();

    res.status(200).json({ message: "Prescription process completed successfully", medication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was an error completing the prescription process" });
  }
};


// creating the Logout function for me  using jwt 
const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    
    // Add the token to the blacklist with its expiration time
    const expiresAt = new Date(decoded.exp * 1000); // Token expiration time
    const blacklistedToken = new Blacklist({ token, expiresAt });

    await blacklistedToken.save();

    res.status(200).json({ message: "You have been logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Logout failed" });
  }
};














module.exports={
  createUser,
  login,
  sendPatientsDetails:[verifyToken,sendPatientsDetails],
  allPatients:[verifyToken,allPatients],
  getSinglePatient:[verifyToken,getSinglePatient],
  updatePatients:[verifyToken,updatePatients],
  prescribeMedication:[verifyToken,prescribeMedication],
  getDrugsPrescribed:[verifyToken,getDrugsPrescribed],
  donePrescription:[verifyToken,donePrescription],
  logout:[verifyToken,logout]

}