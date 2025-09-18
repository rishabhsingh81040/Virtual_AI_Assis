import React, { useContext, useState } from 'react'
import bg from "../assets/Assistant1.jpg"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {useNavigate} from "react-router-dom"
import { userDataContext } from '../context/UserContext.jsx';
import axios from "axios"
function SignUp(){
    const [showPassword,setShowPassword]=useState(false)
    console.log(`${useContext(userDataContext)}`)
    const {serverUrl,userData, setUserData}=useContext(userDataContext)
    const navigate=useNavigate()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setloading] =useState("")
    

    const [err,setErr]=useState("")
    const handleSignUp =async(e)=>{
        e.preventDefault()
        setloading(true)

        setErr("")
        try {
            let result=await axios.post(`${serverUrl}/api/auth/signup`,{
                name,email,password
            },{withCredentials:true})
            setUserData(result.data)
            setloading(false)
            navigate("/customize")
        } catch (error) {
            console.log(error)
            setUserData(null)
            setloading(false)
            setErr(error.response.data.message)
        }
    }
    return(
        <div className='w-full h-[120vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}}>
            <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-blue-950 flex flex-col px-[20px] items-center justify-center gap-[20px]'onSubmit={handleSignUp}>
            <h1 className='text-white text-[30px] font-semibold mt-[30px]'>Register to <span className='text-blue-400'>Virtual Assistant</span></h1>
            <input type="text" placeholder='Enter your Name' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setName(e.target.value)}value={name}/>
            <input type="email" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' autoComplete='username' required onChange={(e)=>setEmail(e.target.value)}value={email} />
            <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
                <input type={showPassword?"text" :"password"} placeholder='password' className='w-full h-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] rounded-full ' autoComplete='current-password' required onChange={(e)=>setPassword(e.target.value)}value={password}/>
                {!showPassword &&<FaEye className='absolute top-[15px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(true)}/>}
                {showPassword &&<FaEyeSlash className='absolute top-[15px] right-[20px] text-[white] w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(false)}/>}

            </div>
            {err.length>0 && <p className='text-red-500 text-[18px]'>*{err}</p>}
            <button className='min-w-[200px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] cursor-pointer hover:shadow-2xl  hover:shadow-blue-800 hover:border-1 hover:border-#202353' disabled={loading}>{loading?"Loading...":"SignUp"}</button>
            <p className='text-[white] text-[18px] cursor-pointer' onClick={()=>navigate("/signin")}>Already have an account?<span className='text-blue-400'> 
                Sign In</span></p>
            </form>
            
            
        </div>
    )
}

export default SignUp