import { nanoid } from "nanoid";
import userModel from "../../../../DB/model/User.model.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import sendEmail, { createHtml } from "../../../utils/email.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import CryptoJS from "crypto-js";
// import { compare } from "bcryptjs";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { CartModel } from "../../../../DB/model/cart.model.js";

export const SignUP=asyncHandler(async(req,res,next)=>{
    const IsEmailExist=await userModel.findOne({email:req.body.email})
    if(IsEmailExist){
        return next (new Error (`THIS EMAIL '${req.body.email}'ALREADY EXIST!`,{cause:409}))
    }

req.body.phone=CryptoJS.AES.encrypt(req.body.phone,process.env.ENCRYPTION_KEY).toString()
req.body.password=hash(req.body.password)
const code=nanoid(6)
const Html=createHtml(code)
sendEmail({to:req.body.email,subject:"CONFIRM EMAIL",html:Html})
req.body.code=code
const user=await userModel.create(req.body)
await CartModel.create({UserId:user._id})//kda m3 kol user gdyd byd5ol hyt3mlo cart
res.status(201).json({message:"SIGNUP SUCCESSFULLY!",user})

//bdl ma kont fy al confirm email bb3tlo zy link wby7awlo 3ala browser fa lw ana maslan m4 m3aya 7ad front al 27san akon 48al fy nafs al applecation bdl ma a7awl al user 3ala mkan tany
//h3ml kda b 2ny hb3t zy code 3ala al mail whwa hy5od al code dh why3ml confirm byh
})
export const confirmEmail=asyncHandler(async(req,res,next)=>{
    const{email,code}=req.body //almafrod al 7agat dy 2ly yb3thaly 2ly 48al fy al front
    const IsEmailExist=await userModel.findOne({email:req.body.email})
    if(!IsEmailExist){
        return next (new Error (`THIS EMAIL '${req.body.email}'NOT FOUND!`,{cause:400}))
    }
    if(code!=IsEmailExist.code){
        return next (new Error ("IN_VALID CODE!",{cause:400}))
    }
    const Newcode=nanoid(6) //3amlt al 7ta dy 3l4an hwa by3ml confirm bl code mara wa7da kda k2ny 5alyt al code y7salo expire 2ly hwa hym4y awl mara b3dyn a3ml wa7d gdyd
    const confirmedUser=await userModel.updateOne({email},{confirmEmail:true,code:Newcode}) //hna ana b2olo ro7 gyb al uer 2ly bl email 2ly d5l dh w8ayr al confirmemail 5alyha b true w kda kda ana 3amla al email unique
    res.status(200).json({message:"CONFIRMED SUCCESS!",confirmedUser})
})
export const signIn=asyncHandler(async(req,res,next)=>{
    const{email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return next (new Error (`THIS EMAIL '${email}'NOT EXIST!`,{cause:400}))
    }
    const match=compare(password,user.password)
    if(!match){
        return next (new Error ("IN_VALID USER INFO!"),{cause:400})
    }
    const payload={
        id:user._id,
        email:user.email,
    }
    const token=generateToken({payload})
    res.status(200).json({message:"SIGN IN SUCCESS!",token})

})
export const sendCode=asyncHandler(async(req,res,next)=>{ //b3mlo 3l4an forget password
    const{email}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return next (new Error (`THIS EMAIL '${email}'NOT EXIST!`,{cause:400}))
    }
    const code=nanoid(6)
    const Html=createHtml(code)
    sendEmail({to:req.body.email,subject:"RESET PASSWORD",html:Html})
    await userModel.updateOne({email},{code})
    res.status(200).json({message:"CODE SEND TO EMAIL!"})
})
export const ResetPassword=asyncHandler(async(req,res,next)=>{
    let{email,code,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return next (new Error (`THIS EMAIL '${email}'NOT EXIST!`,{cause:400}))
    }
    if(code!=user.code){
        return next (new Error ("IN_VALID CODE!",{cause:400}))
    }
    password=hash(password)
    const Newcode=nanoid(6) 
    await userModel.updateOne({email},{
        password,
        code:Newcode
    })
    res.status(200).json({message:"PASSWORD UPDATED SUCCESSFULLY!"})
})
