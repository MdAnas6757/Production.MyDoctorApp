const express = require("express");
const {
  loginController,
  registerController,
  authcontroller,
  applyDoctorcontroller,
  getAllNotificationcontroller,getDoctorsController,
  bookappointmentController,
  bookingAvailabiltyController,
  appointmentsListController,
  userfeedbackController,
  deleteNotificationcontroller,

} = require("../controllers/userCtrl");
const authmiddleware=require("../middlewares/authMIddleware")
//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);
router.post("/getUserData",authmiddleware,authcontroller)
router.post("/apply-doctor",authmiddleware,applyDoctorcontroller)
router.post("/get-all-notifications",authmiddleware,getAllNotificationcontroller)
//delete all notifications
router.post("/delete-all-notifications",authmiddleware,deleteNotificationcontroller)
//get All doctor-list
router.get('/getDoctors',authmiddleware,getDoctorsController)
//book appointment
router.post('/book-appointment',authmiddleware,bookappointmentController)
//booking availaibilty
router.post('/booking-availibilty',authmiddleware,bookingAvailabiltyController)
//appointments list
router.get("/appointments-list",authmiddleware,appointmentsListController)
module.exports = router;
//feedback
router.post("/user-feedback",authmiddleware,userfeedbackController);