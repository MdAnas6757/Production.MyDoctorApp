const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment=require('moment');
const feedbackModel = require("../models/feebackModel");
//register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Sucessfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

// login callback
const loginController = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      
      if (!user) {
        return res
          .status(200)
          .send({ message: "user not found", success: false });
      }
      if(user.isBlocked)
      {
        return res
          .status(200)
          .send({ message: "User blocked", success: false });

      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Invlid EMail or Password", success: false });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {

        expiresIn: "1d",
      });
      res.status(200).send({ message: "Login Success", success: true, token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
    }
  };
  //authorization

  const authcontroller=async(req,res)=>{
    
    try {
      const user=await userModel.findOne({_id:req.body.userId});
      
      user.password=undefined;
      if(!user)
      {
        
        return res.status(200).send({
          message:"user not found",
          success:false
          
        });

      }else
      {
        
        res.status(200).send({
            success:true,
            data:user,
        })
      }
      
    } catch (error) {
      console.log(error)
      res.status(500).send({
        message:'auth error',
        success:false,
        error
      })
      
    }
  }
  //apply doctor
  const applyDoctorcontroller=async(req,res)=>{
    try 
    {
        
        const newDoctor= await doctorModel({...req.body,status:'pending'})
      await newDoctor.save()
      const adminUser=await userModel.findOne({isAdmin:true})
      const notification=adminUser.notification
      notification.push({
        type:'apply-doctor-request',
        message:`${newDoctor.firstName} ${newDoctor.lastName} Has Applied for a doctor appointment`,
        data:{
          doctorId:newDoctor._id,
          name:newDoctor.firstName + " " + newDoctor.lastName,
          onClickPath: "/admin/doctors",

        },

      });
      await userModel.findByIdAndUpdate(adminUser._id,{ notification});
      res.status(201).send({
        success:true,
        message:"Doctor Acount Applied Successfully",
      })
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success:false,
        error,
        message:"Error while Applying doctor"
      })
      
    }
  }
  //notification
  const getAllNotificationcontroller= async(req,res)=>{
    try {
      const user=await userModel.findOne({_id:req.body.userId})
      const seennotification=user.seennotification
      const notification=user.notification;
      seennotification.push(...notification);
      user.notification=[];
      user.seennotification=notification
      const updatedUser=await user.save()
      res.status(200).send({
        success:true,
        message:"All notifications are read",
        data:updatedUser,


      });
      
    } catch (error) 
    {
      console.log(error);
      res.status(500).send({
        message:"Error in notification",
        success:false,
        error,
        
      });
      
    }
  }
  //delete notifications
  const deleteNotificationcontroller=async(req,res)=>{
    try 
    {
      const user=await userModel.findOne({_id:req.body.userId})
      user.notification=[];
      user.seennotification=[];
      const updateUser=await user.save();
      updateUser.password=undefined;
      res.status(200).send({
        success:true,
        message:" Notifications Deleted Successfully",
        data:updateUser,


      });
    } catch (error) 
    {
      console.log(error);
      res.status(500).send({
        message:"Error in deleting notification",
        success:false,
        error,
        
      });

      
    }
  }
  //doctors-list
  const getDoctorsController=async(req,res)=>
  {
    try 
    {
      const doctors=await doctorModel.find({status:"approved"})
        res.status(200).send({
          success:true,
          message:"Doctors List Fetched Successfully",
          data:doctors
        })
    } catch (error) 
    {
      console.log(error);
      res.status(500).send({
        message:"Error in getting doctors",
        success:false,
        error,
        
      });
      
      
    }

  }
  const bookappointmentController=async(req,res)=>
  {
    try 
    {
       req.body.date=moment(req.body.date,"DD-MM-YYYY").toISOString();
       req.body.time=moment(req.body.time,"HH-mm").toISOString();
      req.body.status="pending"
      const newAppointment=new appointmentModel(req.body)
      await newAppointment.save()
      const user=await userModel.findOne({ _id : req.body.doctorInfo.userId});
      user.notification.push(
        {
          type:"New appointment-request",
          message:`A new apointment request from ${req.body.userInfo.name}`,
          onClickPath:"/user/appointments"


        }
      );
        await user.save();
        res.status(200).send({
          success:true,
          message:"Appointment Book Successfully",
        })
      
    } catch (error) 
    {
      console.log(error);
      res.status(500).send({
        message:"Error in appointment",
        success:false,
        error,
        
      });

      
    }
  
  }
  //booking availabilty
  const bookingAvailabiltyController = async (req, res) => {
    try {
      const currentDate = moment().startOf('day');
const inputDate = moment(req.body.date, 'DD-MM-YYYY');
const isDateValid = inputDate.isSameOrAfter(currentDate, 'day'); // Compare only the date portion

if (!isDateValid || !inputDate.isValid()) {
  return res.status(200).send({
    message: "Invalid date. Please select today or a future date.",
    success: false
  });
}
// Get the doctor's working hours
// Get the doctor's timings
const inputTime = moment(req.body.time, 'HH:mm');
const doctorId = req.body.doctorId;
const doctor = await doctorModel.findById(doctorId);
const timings = doctor.timings;

if (!timings || !Array.isArray(timings) || timings.length !== 2) {
  return res.status(200).send({
    message: "Doctor's timings not available",
    success: false
  });
}

const workingFrom = moment(timings[0], 'HH:mm');
const workingTo = moment(timings[1], 'HH:mm');

if (!inputTime.isBetween(workingFrom, workingTo)) {
  return res.status(200).send({
    message: "Doctor not available at this time",
    success: false
  });
}
    
      const date = inputDate.toISOString();
      
      const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
      const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
        
      const appointments = await appointmentModel.find({
        doctorId,
        date,
        time: { $gte: fromTime, $lte: toTime }
      });
      
      

      if (appointments.length > 0) {
        return res.status(200).send({
          message: "Appointment not available at this time",
          success: true
        });
      } else {
        return res.status(200).send({
          message: "Appointment available",
          success: true
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error in appointment",
        success: false,
        error
      });
    }
    
  };
  
  // Function to check doctor's availability based on the doctor document
  
  
  const appointmentsListController=async(req,res)=>{
    try 
    {
       const appointments=await appointmentModel.find({userId:req.body.userId});
       res.status(200).send({
          success:true,
          message:"Users Appointments Feth Successfully",
          data:appointments,
       });

      
    } catch (error) 
    {
      console.log(error);
      res.status(500).send({
        message:"Error in appointment list",
        success:false,
        error,
        
      });
      
    }
  }
  //feedback controller
    const userfeedbackController=async(req,res)=>{
      try 
      {
        const feedback=new feedbackModel(req.body);
        await feedback.save();
        res.status(200).send({
          success:true,
          message:"Feedback Submitted Succesfully",
        }) 
      } catch (error) 
      {
        console.log(error);
      res.status(500).send({
        message:"Cannot Submit feedback !",
        success:false,
        error,
        
      });

        
      }
    }

  module.exports = { loginController, registerController,authcontroller,applyDoctorcontroller,getAllNotificationcontroller,getDoctorsController,bookappointmentController,bookingAvailabiltyController,appointmentsListController,userfeedbackController,deleteNotificationcontroller};