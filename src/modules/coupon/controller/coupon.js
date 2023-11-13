import { CuponModel } from "../../../../DB/model/cupon.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createcupon=asyncHandler(async(req,res,next)=>{
    const{code,amount,EXPDate,numofUses}=req.body
    const cuponExist=await CuponModel.findOne({code})
    if(cuponExist){
        return next (new Error (`${code} ALREADY EXIST!`,{cause:400}))
    }
    const cupon= await CuponModel.create({
        code,amount,EXPDate,numofUses,
        createdBy:req.user._id
    })
    res.status(201).json({message:"DONE",cupon})
})