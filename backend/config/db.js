import mongoose from "mongoose"

const connectDb=async ()=>{
    try{
        await mongoose.connect(process.env.MongoDB_URL)
        console.log("db conneted")
    }catch(error){
        console.log(error)
    }
    
}
export default connectDb