import exp from 'express'

import {connect} from 'mongoose'
import {adminApp} from './APIs/AdminAPI.js'
import {authorApp} from './APIs/AuthorAPI.js'
import {userApp} from './APIs/UserAPI.js'
import {commonApp} from './APIs/CommonAPI.js'
import  cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();



// creating an express application
const app=exp()
// server.js
app.use(cors({
  origin: ['https://mern-capstoneproject-frontend-mohiddin-s-projects.vercel.app',"http://localhost:5173"],  
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], 
  credentials: true
}));
// body parser middleware
app.use(exp.json())
app.use(cookieParser())

// path level middleware
app.use("/user-api",userApp);
app.use("/author-api",authorApp);
app.use("/admin-api",adminApp);
app.use("/auth",commonApp);


const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB connected")
        const port=process.env.PORT || 4000
        app.listen(port,()=>console.log(`server listening on ${port}...`))
    }catch(err){
        console.log("error in DB connection",err)
    }
}
connectDB()

// to handle invaild path
app.use((req,res,next)=>{
    console.log(req.url)
    res.status(404).json({message:`path ${req.url} is invalid`})
})

// To Handle errors
app.use((err,req,res,next)=>{
    // ValidationError
    if(err.name==="ValidationError"){
        return res.status(400).json({message:"error occurred",error:err.message})
    }
    // CastError
    if(err.name==="CastError"){
        return res.status(400).json({message:"error occurred",error:err.message})
    }
    // send server side error
    res.status(500).json({message:"error occured",error:err.message})
})
