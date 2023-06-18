const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

const getdocInfoController = async(req,res)=>
{
    try {
        const doctor=await doctorModel.findOne({userId: req.body.userId });
        
        res.status(200).send({
            success:true,
            message:"doctor data fetch success",
            data:doctor
        });
        
    } catch (error) 
    {
        console.log(error)
        res.status(500).send(
            {
                success:false,
                error,
                message:'Error in Fetching Doctor Details'
            }
        )
        
    }

}
const updateProfileController = async(req,res)=>
{
    try 
    {
        const doctor =await doctorModel.findOneAndUpdate(
            
                
            {userId:req.body.userId},req.body
        );
        res.status(201).send(
            {
                success:true,
                message:'Doctor Profile Updated',
                data:doctor
            }
        )

        
    } catch (error)
     {
        console.log(error)
        res.status(500).send(
            {
                success:false,
                error,
                message:'Doctor Profile Update Issue'
            }
        )
        
        
    }

}
const getdoctorByIdController=async (req,res)=>{
    try {
        const doctor=await doctorModel.findOne({_id:req.body.doctorId});
        res.status(200).send({
            success:true,
            message:"Doctor Info fetched",
            data:doctor
        });
        
    } catch (error) 
    {
        console.log(error)
        res.status(500).send(
            {
                success:false,
                error,
                message:'Doctor not found'
            }
        )

        
    }

}
const doctorappointmentController=async(req,res) =>{
    try 
    {
        const doctor=await doctorModel.findOne({userId:req.body.userId})
        const appointments=await appointmentModel.find(
            {
               doctorId:doctor._id, 
            }
        );

     res.status(200).send({
        success:true,
        message:"Doctor Appointments fetch Successfully",
        data:appointments,
     });
        
    } catch (error) 
    {
        console.log(error)
        res.status(500).send(
            {
                success:false,
                error,
                message:'DoctorLists not found'
            }
        )  
        
    }
}
const updateStatusController=async(req,res)=>{
    try 
    {
        const {appointmentsId,status} =req.body;
        const appointments=await appointmentModel.findByIdAndUpdate(
            appointmentsId,{status}
        );
        const user=await userMode.findOne({_id:appointments.userId});
        const notification=user.notification;
        notification.push({
            tyoe:"status-updated",
            message:`your appointment has been updated ${status}`,
             onClickPath:"/doctor-appointments" 
        })
        await user.save();
        res.status(200).send({
            success:true,
            message:"Appointments Status Updated"
        });
        
    } catch (error) 
    {
        console.log(error)
        res.status(500).send(
            {
                success:false,
                error,
                message:'Error in updating Status'
            }
        ) 
        
    }
}
module.exports={getdocInfoController,updateProfileController,getdoctorByIdController,doctorappointmentController,updateStatusController}
