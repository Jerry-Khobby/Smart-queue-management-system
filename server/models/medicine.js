
const mongoose = require("mongoose");


const Schema =mongoose.Schema;
const Medicine = new Schema({
 name:{
  type:String,
  required:true,
 },
 medicineGroup:{
  type:String,
  required:true,
 }, 
 description:{
  type:String,
  required:true,
 },
 owner:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true,
 }

});
// Add a unique compound index on name and owner
Medicine.index({ name: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model('Medicine', Medicine);