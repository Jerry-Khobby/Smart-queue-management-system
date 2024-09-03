const mongoose = require('mongoose');



const MedicationSchema = new mongoose.Schema({
  drugName:{
    type:String,
    required:true,
  },
  dosage:{
    type:String,
    required:true,
  },
  frequency:{
    type:String,
    required:true,
  },
  prescribedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  prescribedDate:{
type:Date,
default:Date.now,
  },
  patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Patient",
    required:true,
  }
})