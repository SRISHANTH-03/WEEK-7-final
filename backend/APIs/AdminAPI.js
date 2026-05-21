import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { UserModel } from '../models/UserModel.js'
export const adminApp=exp.Router()

// get users or authors details
adminApp.get("/users/:user",verifyToken("ADMIN"),async(req,res)=>{
        // allowwedUsers
        const allowedRoles=["USER","AUTHOR"]
        // get the param from url
        const user=req.params.user
        if(!user || !allowedRoles.includes(user.toUpperCase())){
            return res.status(400).json({message:"Invalid user type"})
        }
        const usersList=await UserModel.find({role:user.toUpperCase()},{email:1})
        res.status(200).json({message:`${user} emails`,payload:usersList})
})

// block or activate users

// activte user
adminApp.put("/activate-user",verifyToken("ADMIN"),async(req,res)=>{
    // get the body from req
    const {email}=req.body
    // find the user
    const user=await UserModel.findOne({email:email})
    if(!user){
        return res.status(404).json({message:"No user found"})
    }
    if(user.isUserActive){
        return res.status(400).json({message:"User is already in active state"})
    }
    user.isUserActive=true
    await user.save()
    res.status(200).json({message:"User activated sucessfully"})
})

// block user
adminApp.put("/block-user",verifyToken("ADMIN"),async(req,res)=>{
    // get the body from req
    const {email}=req.body
    // find the user
    const user=await UserModel.findOne({email:email})
    if(!user){
        return res.status(404).json({message:"No user found"})
    }
    if(!user.isUserActive){
        return res.status(400).json({message:"User is already in block state"})
    }
    user.isUserActive=false
    await user.save()
    res.status(200).json({message:"User blocked sucessfully"})
})