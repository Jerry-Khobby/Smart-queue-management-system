
const mongoose = require("mongoose");


const Schema =mongoose.Schema;
const Patient = new Schema({
 name:{
  type:String,
  required:true,
 },
 insuranceNumber:{
  type:String,
  required:true,
  unique:true,
},
age:{
  type:Number,
  required:true,
},
gender:{
  type:String,
  required:true,
},
address:{
  type:String,
  required:true,
},
phone:{
  type:String,
  required:true,
 }, 
 symptoms:{
  type:String,
  required:true,
 },
 diseaseDescription:{
type: String,
required:true,
 },
 queueNumber:{
type:Number,
required:true,
 },
 diseaseStartDate:{
type:Date,
default:Date.now(),
 },
 filled_in:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true,
 }

});
// Add a unique compound index on name and owner
Medicine.index({ name: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Patient', Patient);