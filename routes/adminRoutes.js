const express =require("express")
const router=express.Router()
const authmiddleware=require("../middlewares/authMIddleware");
const { getAllUsersController, getAllDoctorsController ,changeStatusController,getfeedbackController,blockuserController,rejectdoctorController} = require("../controllers/adminCtrl");
//GET USERs
router.get("/getAllUsers",authmiddleware,getAllUsersController);
//GEt doctors
router.get("/getAllDoctors",authmiddleware,getAllDoctorsController)
//post account
router.post("/changeAccountStatus",authmiddleware,changeStatusController)
//get feedbacks
router.get("/get-feedback",authmiddleware,getfeedbackController)
//block users
router.post("/blockUser",authmiddleware,blockuserController)
//reject doctor 
router.post("/rejectdoctor",authmiddleware,rejectdoctorController)
module.exports=router