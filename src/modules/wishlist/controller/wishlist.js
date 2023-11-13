import userModel from "../../../../DB/model/User.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addtoWishList=asyncHandler(async(req,res,next)=>{
    //hst2bl al 7aga 2ly 3ayz y7otha gwa al wishlist
    const productID=req.params.productID
    const product=await productModel.findById(productID)
    if(!product){
        return next (new Error("PRODUCT NOT FOUND!",{cause:404}))
    }
    const user=await userModel.updateOne({_id:req.user._id},{
        $addToSet:{
            favorites:productID
        }
    }) 
    res.status(200).json({message:'DONE',user})
})
export const getUserWishList=asyncHandler(async(req,res,next)=>{
    const userId=req.user._id
    const user=await userModel.findById(userId).populate([{
        path:'favorites'

    }])
    res.status(200).json({message:'DONE',user})

})
export const deleteFromWishList=asyncHandler(async(req,res,next)=>{
    const productID=req.params.productID
    const productExist=await productModel.findById(productID)
    if(!productExist){
        return next (new Error("PRODUCT NOT FOUND!",{cause:404}))
    }
    const product=await userModel.findOneAndUpdate({_id:req.user._id},{
        $pull:{
            favorites:productID
        }
    },{new:true})
    res.status(200).json({message:"REMOVED FROM WISHLIST SUCCESS!",DeletedProduct:productExist})
})
