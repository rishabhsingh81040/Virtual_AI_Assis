import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    assistantName:{
        type:String,
    },
    assistantImage:{
        type:String
    },
    histroy:[{
        type:String
    }]
},{timestamps:true})

const User =mongoose.model("User",userSchema)
export default User