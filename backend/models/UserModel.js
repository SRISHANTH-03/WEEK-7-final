import {Schema,model} from 'mongoose'

const userSchema=new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"]
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already existed"]
    },
    password:{
        type:String,
        required:[true,"Password required"]
    },
    role:{
        type:String,
        enum:["USER","AUTHOR","ADMIN"],
        required:[true,"{Value} is an invaild role"]
    },
    profileImageUrl:{
        type:String
    },
    isUserActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

// create Model
export const UserModel=model("user",userSchema)