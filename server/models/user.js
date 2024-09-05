
const mongoose = require("mongoose");


const Schema =mongoose.Schema;
const User = new Schema({
  userId:{
type:mongoose.Schema.Types.ObjectId,
auto:true,
unique:true,
},
  name:{
    type:String,
    required:true,
  },
  role: {
    type: String,
    enum: ['receptionist', 'nurse', 'doctor', 'admin','pharmacist'],
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  dateEntered:{
    type:Date,
    default:Date.now(),
  },
  contactNumber: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true, // e.g., 'Emergency', 'Pediatrics', 'General Medicine'
  },  
  profileImage: {
    type: String, // URL to the health worker's profile image
  },

})

module.exports = mongoose.model('User', User);