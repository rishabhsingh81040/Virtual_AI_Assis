import React, { useContext } from "react"
import { userDataContext } from "../context/UserContext"

function Cards({image}){
    const {frontentImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage,userData, setUserData,serverUrl:serverUrl}=useContext(userDataContext)
    
    return(
        <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 hover:border-4 hover:border-white cursor-pointer ${selectedImage==image?"border-4 border-white shadow-2xl shadow-blue-800":null}`} onClick={()=>{
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
        }}>
            <img src={image} className="h-full object-cover"/>
 
        </div>
    )
}
 
export default Cards