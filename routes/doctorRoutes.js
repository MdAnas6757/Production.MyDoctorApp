const express=require('express')
const router=express.Router()
const authmiddleware=require("../middlewares/authMIddleware");
const { getdocInfoController ,updateProfileController, getdoctorByIdController,doctorappointmentController,updateStatusController} = require('../controllers/doctorCtrl');
//getr doc info
router.post("/getDoctorInfo",authmiddleware,getdocInfoController);
//post update profile
router.post("/updateProfile",authmiddleware,updateProfileController)
//get single doc-info
router.post("/getdoctorById",authmiddleware,getdoctorByIdController)
//
router.get("/doctor-appointments",authmiddleware,doctorappointmentController)
//update status
router.post("/update-status",authmiddleware,updateStatusController)
module.exports=router;