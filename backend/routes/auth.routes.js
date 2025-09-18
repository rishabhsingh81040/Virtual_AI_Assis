import express from "express"
import { SignIn, logOut, signUp } from "../controllers/auth.controllers.js"

const authRouter =express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/signin",SignIn)
authRouter.get("/logout",logOut)


export default authRouter
