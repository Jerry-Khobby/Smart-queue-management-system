const express= require("express");
const router= express.Router();
const controller= require("../controllers/userController");



router.post("/create",controller.createUser);
router.post("/login",controller.login);
router.post("/patient-details",controller.sendPatientsDetails);
router.get("/patients",controller.allPatients);
router.get("/patient/:insuranceNumber",controller.getSinglePatient);
router.post("/update-patient/:insuranceNumber",controller.updatePatients);
router.post("/patient-prescribe/:insuranceNumber",controller.prescribeMedication);
router.get("/patient-prescribe/:insuranceNumber",controller.getDrugsPrescribed);
router.patch("/prescription/:insuranceNumber",controller.donePrescription);
router.put("/logout",controller.logout);

module.exports=router;