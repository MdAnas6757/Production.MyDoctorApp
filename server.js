const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

const path=require('path')
//rest object
const app=express()
//middleware
 
app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
    origin: 'https://mydoctorapp.onrender.com'
})); 
dotenv.config();
//database coonection
connectDB();
//user routes
app.use("/api/v1/user", require("./routes/userRoutes"));
//admin routes
app.use("/api/v1/admin", require("./routes/adminRoutes"));
//static files
app.use(express.static(path.join(__dirname,'./client/build')))
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
//doctor routes
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));
//feedbacks routes


const port=process.env.PORT||8080
//lisen port
app.listen(port,()=>{
    console.log(`Server Running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`.bgCyan.white)
})