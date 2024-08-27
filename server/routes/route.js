const express= require("express");
const router= express.Router();
const controller= require("../controllers/userController");



router.post("/",controller.createUser);
router.post("/login",controller.login);
router.post("/newdrug",controller.addmedicine);
router.get("/drug",controller.usersdrugs);

module.exports=router;