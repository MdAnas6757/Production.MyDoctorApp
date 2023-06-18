const doctorModel=require('../models/doctorModel');
const feedbackModel = require('../models/feebackModel');
const userModel=require('../models/userModels')
const getAllUsersController=async(req,res)=>{
    try {
        const users = await userModel.find({isBlocked:false});
        res.status(200).send({
            success:true,
            message:"users data",
            data:users,
        });
        
    } catch (error) 
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while fetching users",
            error

        })
        
    }
}
const getAllDoctorsController=async(req,res)=>{
    try 
    {
        const doctors=await doctorModel.find({})
        res.status(200).send({
            success:true,
            message:"doctors data",
            data:doctors,
        });

        
    } catch (error) 
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error while fetching doctors data",
            error        
    })
}
}
//change accountstatus
const changeStatusController=async(req,res)=>
{
    try 
    {
        const {doctorId,status}=req.body
        const doctor=await doctorModel.findByIdAndUpdate(doctorId,{status})
        const user=await userModel.findOne({_id:doctor.userId})
        const notification=user.notification
        notification.push({
            type:'doctor-account-request-updated',
            message:`Your Doctor Account request has been ${status}`,
            onClickPath:'/notification'
        })
        user.isDoctor = status==="approved"? true: false
          await user.save();
          res.status(201).send({
            success:true,
            message:'Account Status Updated',
            data:doctor
          })

    } catch (error) 
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Account Status",
            error 
        
    })
}


}
//reject doctor status
const rejectdoctorController=async(req,res)=>
{
    try 
    {
        const {doctorId}=req.body
        const doctor=await doctorModel.findOne(doctorId)
        const user=await userModel.findOne({_id:doctor.userId})
        const notification=user.notification
        notification.push({
            type:'doctor-account-request-updated',
            message:`Your Doctor Account request has been rejected`,
            onClickPath:'/notification'
        })
        user.isDoctor =false;
          await user.save();
          await doctorModel.deleteOne(doctorId);
          res.status(201).send({
            success:true,
            message:'Request to doctor approval has been cancelled',
            data:doctor
          })

    } catch (error) 
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in rejecting doctor approval",
            error 
        })
    }
  

}
//get feedbacks
const getfeedbackController=async(req,res)=>{
    try 
    {
        const user=await userModel.findOne({_id:req.body.userId});
        const feedbacks=await feedbackModel.find({})
         res.status(200).send({
            success:true,
            message:"Users Feedbacks",
            data:feedbacks,
            
         });
         console.log(feedbacks);
        
    } catch (error) 
    {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Fetching users feedback",
            error 

        
    })
}
}
//Block users
const blockuserController=async(req,res)=>{
    console.log(req.body);
    try 
    {
        const { userName } = req.body;
        
        const user = await userModel.findOne({ name: userName });
        console.log(user);
        if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.isBlocked= true;
    await user.save();
    res.status(200).send({
        success:true,
        message:"User has been blocked",
        
     });
        
    } catch (error) 
    {
        
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error while blocking user",
            error 
        })
        
    }
}
module.exports={getAllUsersController,getAllDoctorsController,changeStatusController, getfeedbackController,blockuserController,rejectdoctorController}