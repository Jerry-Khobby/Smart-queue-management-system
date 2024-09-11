const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PatientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  insuranceNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  symptoms: {
    type: String,
    required: true,
  },
  diseaseDescription: {
    type: String,
    required: true,
  },
  queueNumber: {
    type: Number,
    required: true,
  },
  diseaseStartDate: {
    type: Date,
    required:true,
  },
  recordingDate:{
type:Date,
default:Date.now(),
required:true,
  },
  filled_in: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model (e.g., receptionist, nurse)
    required: true,
  },
  medications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
    },
  ],
});

PatientSchema.index({ queueNumber: 1, recordingDate: 1 }, { unique: true });

// Create the Patient model
module.exports = mongoose.model('Patient', PatientSchema);
