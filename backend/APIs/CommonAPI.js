import exp from 'express'
import {UserModel} from '../models/UserModel.js'
import {hash,compare} from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middlewares/verifyToken.js'
import multer from 'multer'
const {sign}=jwt
export const commonApp=exp.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

// Route for register
commonApp.post('/user', upload.single('profileImageUrl'), async (req, res) => {
  let allowedRoles = ['USER', 'AUTHOR']

  const newUser = req.body  // ✅ now populated because multer parsed multipart

  if (!allowedRoles.includes(newUser.role)) {
    return res.status(400).json({ message: "Invalid role" })
  }

  // file is in req.file if you want to save it to cloudinary later
  // for now just ignore it and save user without image
  newUser.password = await hash(newUser.password, 12)

  const newUserDocument = new UserModel(newUser)
  await newUserDocument.save()
  res.status(201).json({ message: "User created" })
})
// Route for Login (USER,ADMIN,AUTHOR)
commonApp.post('/login',async(req,res)=>{
    // get email,password from req.body
    const {email,password}=req.body
    // verify email and password
    const user=await UserModel.findOne({email:email})
    if(!user){
        return res.status(400).json({message:"Invalid email"})
    }
    const vaildPassword=await compare(password,user.password)
    if(!vaildPassword){
        return res.status(400).json({message:"Invaild password"})
    }

    // after verification generate a token 
    const signedToken=sign({id:user._id,email:email,role:user.role},process.env.SECRET_KEY,{expiresIn:'1h'})
    // store the token in httpOnly cookie
    res.cookie("token",signedToken,{
        httpOnly:true,
        sameSite:"None",
        secure:true
    })
    // delete password from user object
    const userObj=user.toObject()
    delete userObj.password
    res.status(200).json({message:"Login sucess",payload:userObj})

})
// Route for Logout
commonApp.get("/logout",(req,res)=>{
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    })
    res.status(200).json({message:"Logout success"})
})

// change password
commonApp.put("/password",verifyToken("USER","AUTHOR","ADMIN"),async(req,res)=>{
    // check current password and new password are same
    const {currentPassword,newPassword}=req.body
    if(currentPassword===newPassword){
        return res.status(400).json({message:"Password should not be same"})
    }
    // get current password of user/admin/author
    const userId=req.user?.id
    const UserDocument=await UserModel.findById(userId)
    const isMatch=await compare(currentPassword,UserDocument.password)
    if(!isMatch){
        return res.status(400).json({message:"Yours current password is wrong"})
    }
    const newPasswordHash=await hash(newPassword,12)
    UserDocument.password=newPasswordHash
    await UserDocument.save()
    res.status(200).json({message:"password changed successfully"})
})