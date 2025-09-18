import User from '../models/user.model.js'
import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from '../gemini.js'
import moment from 'moment';
export const getCurrentUser=async(req,res)=>{
    try {
        const userId=req.userId
        const user =await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({message:"get current user error"})
    }
}

export const updateAssistant=async (req,res)=>{
    try {
        const {assistantName,imageUrl} =req.body
        let assistantImage;

        if (!assistantName || !assistantName.trim()) {
            return res.status(400).json({ message: "Assistant name is required" });
        }

        if(req.file){
            assistantImage=await uploadOnCloudinary(req.file.path)
        }
        else{
            assistantImage=imageUrl
        }
        const user= await User.findByIdAndUpdate(req.userId,{
            assistantName:assistantName.trim(),
            assistantImage
    
        },{new:true}).select("-password")
        return res.status(200).json(user)

    } catch (error) {
        return res.status(400).json({message:"update assistant error"})

    }

}



export const askToAssistant = async (req,res)=>{
    try {
        const {command} = req.body
        const user = await User.findById(req.userId)
        //user.histroy.push({command})
        //await user.save()
        const userName = user.name
        const assistantName = user.assistantName

        const result = await geminiResponse(command,assistantName,userName)

        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(500).json({ message: "sorry, I cann't understand" });
        }
        const geminiResult = JSON.parse(jsonMatch[0]);
        const type = geminiResult.type;
        switch(type){
            case "get_date":
                return res.json({
                    type,
                    userInput:geminiResult.userInput,
                    response:`Today is ${moment().format("Do MMMM YYYY")}`
                });
            case "get_time":
                return res.json({
                    type,
                    userInput:geminiResult.userInput,
                    response:`Current time is ${moment().format("hh:mm a")}`
                });
            case "get_day":
                return res.json({
                    type,
                    userInput:geminiResult.userInput,
                    response:`Today is ${moment().format("dddd")}`
                });
            case "get_month":
                return res.json({
                    type,
                    userInput:geminiResult.userInput,
                    response:`Current month is ${moment().format("MMMM")}`
                });

            case "general":
            case "google-search":
            case "youtube-search":
            case "youtube_play":
            case "calculator_open":
            case "instagram_open":
            case "facebook_open":
            case "wikipedia-search":
            case "whatsapp_open":
            case "news-search":
            case "weather-show":
            case "joke":
            case "quote":
            case "fact":
            case "advice":
            case "calendar":
            case "music-playback":
            case "video-playback":
            case "navigation":
            case "translation":
            case "send_email":
            case "make_call":
            case "play_music":
            case "play_video":
            case "provide_navigation":
                return res.json({
                    type,
                    userInput:geminiResult.userInput,
                    response:geminiResult.response,
                })
            default:
                return res.status(400).json({ response: "sorry, I cann't understand" });
        }
        
    } catch (error) {
        return res.status(500).json({ response: "ask assistant error" });

    }
}