import React, { useEffect, useState } from "react";
import { createContext } from "react";
export const userDataContext =createContext()
import axios from "axios";

function UserContext({children}){
    const serverUrl="https://virtual-ai-assis-backend.onrender.com";
    const [userData, setUserData]=useState(null)

    const[frontentImage,setFrontendImage]=useState(null)
    const[backendImage,setBackendImage]=useState(null)
    const [selectedImage,setSelectedImage]=useState(null)

    const handleCurrentUser=async() =>{
        try {
            const result= await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            setUserData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }


    const getGeminiResponse =async(command)=>{
        try {
            const response = await axios.post(`${serverUrl}/api/user/asktoassistant`,{
                command:command
            },{withCredentials:true,
                headers:{
                    'Content-Type':
                    'application/json'
                }
            });
            return response.data
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    useEffect(()=>{
        handleCurrentUser()
    },[]);

    const value ={
        frontentImage,setFrontendImage,
        backendImage,setBackendImage,
        selectedImage,setSelectedImage,
        userData, setUserData,
        serverUrl: serverUrl,
        getGeminiResponse,
    }
    return (
        <div>
            <userDataContext.Provider value={value}>
            {children}
            </userDataContext.Provider>
        </div>
    );
}


export default UserContext
