const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MedicationSchema = new Schema({
  drugName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
  },
  prescribedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the doctor who prescribed the medication
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", // Reference to the patient
    required: true,
  },
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the pharmacist who dispensed the medication
  },
  dispensedDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Prescribed", "Dispensed", "Not Available"],
    default: "Prescribed",
  }
});

module.exports = mongoose.model('Medication', MedicationSchema);
