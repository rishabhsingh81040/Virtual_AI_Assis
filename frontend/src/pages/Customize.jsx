import React, { useContext, useRef, useState } from "react"
import Cards from "../components/Cards"
import image1 from "../assets/Assistant1.jpg"
import image2 from "../assets/Assistant2.jpg"
import image3 from "../assets/Assistant3.jpg"
import image4 from "../assets/Assistant4.jpg"
import image5 from "../assets/Assistant5.jpg"
import image6 from "../assets/Assistant6.jpg"
import image7 from "../assets/Assistant7.jpg"
import {RiImageAddLine} from "react-icons/ri"
import { userDataContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { IoArrowBackSharp } from "react-icons/io5";


function Customize(){
    const {frontentImage,setFrontendImage,backendImage,setBackendImage,selectedImage,setSelectedImage,userData, setUserData,serverUrl: serverUrl}=useContext(userDataContext)
    const inputImage=useRef()
    const navigate=useNavigate()
    const handleImage=(e)=>{
        const file=e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
    }
    return(
        <div className="w-full h-full min-h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
            <IoArrowBackSharp className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]" onClick={()=>navigate("/")}/>
            <h1 className="text-white mb-[40px] text-[30px] text-center  mt-[20px] ">Select your <span className="text-blue-200">Assistant Image</span></h1>
            <div className="w-full max-w-[60%] flex justify-center items-center flex-wrap gap-[15px]">
                <Cards image={image1}/>
                <Cards image={image2}/>
                <Cards image={image3}/>
                <Cards image={image4}/>
                <Cards image={image5}/>
                <Cards image={image6}/>
                <Cards image={image7}/>
                <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 hover:border-4 hover:border-white cursor-pointer flex items-center justify-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-800":null}`} onClick={()=>{
                    inputImage.current.click()
                    setSelectedImage("input")
                    }}>
                {!frontentImage && <RiImageAddLine className="text-white w-[25px] h-[25px] "/>}
                {frontentImage && <img src={frontentImage} className="h-full obj-cover"/>}
                </div>

                <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage}/>
            </div>
            {selectedImage && <button className='min-w-[210px] h-[60px] m-[20px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer  hover:shadow-blue-800 hover:border-1 hover:border-#202353' onClick={()=>navigate("/customize2")}>Next</button> }

        </div>
    )
}
 
export default Customize

