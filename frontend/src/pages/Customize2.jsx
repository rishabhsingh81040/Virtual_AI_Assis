import React, { useContext, useState } from "react"
import { userDataContext } from "../context/UserContext"
import axios from "axios"
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


function Customize2(){
    const {userData,backendImage,selectedImage,serverUrl,setUserData} =useContext(userDataContext)
    const [assistantName,setAssistantName]=useState( userData?.assistantName ||"" )
    const navigate= useNavigate()

    const [loading,setLoading]=useState(false)
    const handleUpdateAssistant = async ()=>{
        setLoading(true);
        try {
            const formData=new FormData()
            formData.append("assistantName",assistantName)
            if(backendImage){
                formData.append("assistantImage",backendImage)
            }
            else if(selectedImage && selectedImage!=="input"){
                formData.append("imageUrl",selectedImage)
            }

            console.log("Sending:");
            console.log("assistantName:", assistantName);
            console.log("backendImage:", backendImage);
            console.log("selectedImage:", selectedImage);

            const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
                withCredentials:true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
        });
            console.log(result.data)
            setUserData(result.data)
            navigate("/")
        } catch (error) {
            console.log("error occur at",error)
            if (error.response) {
                console.log("Error response:", error.response.data);
                alert(`Update failed: ${error.response.data.message}`);
            } else {
                alert("Network error - please check if server is running");
            }
        }finally {
            setLoading(false);
        }
    }
    

    return(
        <div className="w-full min-h-[100vh] h-full relative bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
            <IoArrowBackSharp className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]" onClick={()=>navigate("/customize")}/>            
            <h1 className="text-white  mb-[40px] text-[30px] text-center  mt-[20px]">Enter Your <span className="text-blue-200">Assistant Name</span></h1>
            <input type="text" placeholder='eg : Javis' className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
            {assistantName && (<button className=' min-w-[300px] h-[60px] m-[20px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer hover:shadow-2xl hover:shadow-blue-800 hover:border-1 hover:border-#202353' disabled={loading} onClick={()=>
                handleUpdateAssistant()
                }>{!loading?"Create Your Assistant Name":"Loading..."}</button>)}
            
        </div>
    )
}
 
export default Customize2