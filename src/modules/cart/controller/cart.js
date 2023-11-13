import { CartModel } from "../../../../DB/model/cart.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const AddToCart=asyncHandler(async(req,res,next)=>{
    const {productId,quantity}=req.body
    const product=await productModel.findById(productId)
    if(!product){
        return next (new Error("PRODUCT NOT FOUND!",{cause:400}))
    }
    //check if al quantity avalivble wla la
    if(product.stock<quantity){
        await productModel.updateOne({_id:productId},{
            $addToSet:{
            wishlist:req.user._id //hdafha anha mtdf4 fy al cart nafs al product kaza mara y3ny lw hwa mawgod yzawd al 3add
        }})
        return next (new Error("OUT OF STOCK!",{cause:400}))
    }
    //h3ml wishlist lw al product dh m4 mawgod lma arg3 adyfo ab3atlhom mail ano gh
    const cart=await CartModel.findOne({UserId:req.user._id})
    //check if the product exist in cart alreadyb 3l4an lw mawgoda hzawd 3dd bs
    const productIndex=cart.products.findIndex((product=>{
        return product.product==productId //hna dh hy4of bl index 3latol lw la2a al productid dh mawgod hyrg3o lw la hyrg3 -1
    }))
    if(productIndex==-1){
        cart.products.push({
            product:productId,
            quantity
        })
    }else{
        cart.products[productIndex].quantity=quantity //kda lw al product dh mawgod hy8yr kymt al quaantity bs
    }
    await cart.save() //m3ml4 al save dy fy 7agat al user 3l4an al userc marbot b7agat tanya fa 2y t8yr hybawz al dnya
    res.status(201).json({message:'ITEM ADDED TO CART',cart})



})
export const deletefromCart=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const product=await CartModel.findOne({
        UserId:req.user._id, //3andy al cart bt3t al user dy wla la
        //h3ml find litem mo3ayn mawgod gwa al cart
        'products.product':id
    })
    if(!product){
        return next (new Error("PRODUCT NOT FOUND!",{cause:400}))
    }
    //addtoset & pull works only on array
    //make the delete
    const cart=await CartModel.findOneAndUpdate({UserId:req.user._id},{
        $pull:{ //h3ml pull mnyn ..>products array //h3ml pull 3ala 2y 2sas bzbt ..>3ala 2sas al product id
            products:{
                product:id
            }
        }
    },{new:true})
    res.status(200).json({message:"DELETED SUCCESS!",cart})
})
export const getUserCart=asyncHandler(async(req,res,next)=>{
   
    const cart=await CartModel.findOne({UserId:req.user._id}).populate([{
        path:'products.product',
        select:'price name priceAfterDiscount description image',
        populate:[{
            path:'categoryID',
            select:"name"
        },
        {
            path:'subcategoryID',
            select:"name"
        },
        {
            path:'brandID',
            select:"name"
        }
    ]
    }])
    //lw maslan al admin 4al al producr mn al sysytem 5als wkan lsa 3andy fy al cart hy3ml mo4kla s3t al payment fa almafrod 2alf 3ala kol al products 2ly 3andy 23ml check homa mawgodyn wla la
    let totalprice=0
    cart.products=cart.products.filter(ele=>{
        if(ele?.product){
            //h3ml al total price 2ly byt7sb 3ala 7asb al products 2ly e3andy 2ly hwa 2s3arc al products kolha 2ly y al cart
            totalprice+=(ele.product.priceAfterDiscount*ele.quantity)
            return ele
        }
    })
    await cart.save()
    res.status(200).json({message:"DONE",cart,totalprice})
})