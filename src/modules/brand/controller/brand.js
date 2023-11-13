import slugify from "slugify";
import { categoryModel } from "../../../../DB/model/Category.model.js";
import { SubCategoryModel } from "../../../../DB/model/SubCategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import { customAlphabet } from "nanoid";
import { BrandModel } from "../../../../DB/model/Brand.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { paginationfunction } from "../../../utils/pagination.js";
import { productModel } from "../../../../DB/model/product.model.js";
const nanoid=customAlphabet('1123456!=abcderfg ',5)

export const addbrand=asyncHandler(async(req,res,next)=>{
    const {name}=req.body
    const userId=req.user._id
    const {subcategoryID,categoryID}=req.query
    const categoryExist=await categoryModel.findById(categoryID)
    if(!categoryExist){
        return next (new Error("IN_VALID CATEGORY ID"))
    }
    const subcategoryExist=await SubCategoryModel.findById(subcategoryID)
    if(!subcategoryExist){
        return next (new Error("IN_VALID SUBCATEGORY ID"))
    }
    if(await BrandModel.findOne({name})){
        return next (new Error("BRAND NAME ALREADY EXIST!"),{cause:400})
    }
    
    if(!req.file){
        return next(new Error("PLEASE UPLOAD A BRAND LOGO!"))
    }
    const customID=nanoid()
    const slug=slugify(name,'_')
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder: `E-Commerce/Category/${categoryExist.customID}/SubCategory/${subcategoryExist.customID}/brand/${customID}/brandphoto`})
    const brandObject={
        name,
        slug,
        logo:{
            secure_url,
            public_id,
        },
        customID,
        categoryID,
        subcategoryID,
        createdBy:userId
        
    }
    const brand=await BrandModel.create(brandObject)
    if(!brand){
        await cloudinary.uploader.destroy(public_id)
        return next(new Error ("TRY AGAIN LATER! FAILED TO ADD BRAND",{cause:400}))
    }
    res.status(200).json({message:"BRAND ADDED SUCCESS!",brand})
})
export const updateBrand=asyncHandler(async(req,res,next)=>{
    const{brandId}=req.params
    const{name}=req.body
    const{categoryID,subcategoryID}=req.query
    const brand=await BrandModel.findById(brandId)
    if(!brand){
        return next (new Error("IN_VALID BRAND ID",{cause:400}))
    }
    const categoryExist=await categoryModel.findById(categoryID||brand.categoryID)
    if(categoryID){
        if(!categoryExist){
            return next (new Error("IN_VALID CATEGORY ID",{cause:400}))
        }
        brand.categoryID=categoryID
    }
    const subcategoryExist=await SubCategoryModel.findById(subcategoryID||brand.subcategoryID)
    if(subcategoryID){
        if(!subcategoryExist){
            return next (new Error("IN_VALID SUBCATEGORY ID",{cause:400}))
        }
        brand.subcategoryID=subcategoryID
    }
    if(name){
        if(brand.name==name){
            return next (new Error("PLEASE ENTER DIFF NAME FROM THE OLD ONE !",{cause:409}))
        }
        if(await BrandModel.findOne({name})){
            return next (new Error("THIS BRAND NAME ALRAEDY EXIST!",{cause:409}))
        }
        brand.name=name
        brand.slug=slugify(name,'_')
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder: `E-Commerce/Category/${categoryExist.customID}/SubCategory/${subcategoryExist.customID}/brand/${brand.customID}/brandphoto`})
        const brandPhoto=await BrandModel.findByIdAndUpdate(brandId,
        { logo:{secure_url,public_id}},{new:false})//h3ml new b false 3l4an t5aznly al nos5a al 2adyma mn al id bt3 al sora wb3dyn 22dr amsa7o
        await cloudinary.uploader.destroy(brandPhoto.logo.public_id)
    }
    await brand.save()
    res.status(200).json({message:"UPDATED SUCCESS!",brand})
})
export const getallbrands=asyncHandler(async(req,res,next)=>{
    const mongoseQuery= BrandModel.find().populate([{ //each brand and product must be under the same subcategory?
        path:'product',
        select:'name',
        populate:[{
            path:'subcategoryID',
            select:'name'
        }]

    }])
    const apiFeatures=new ApiFeatures(mongoseQuery,req.query).fields().filter().search().sort()
    const {page,size}=req.query
    const {limit,skip}=paginationfunction({page,size})
    mongoseQuery.skip(skip).limit(size)
    const brands=await apiFeatures.mongoseQuery
    res.status(200).json({message:'DONE',brands})
})
export const getbrandbyid=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const brand=await BrandModel.findById(id).populate([{
        path:'subcategoryID',
        select:'name'

    }])
    if(!brand){
        return next (new Error("IN_VALID BRAND ID",{cause:400}))
    }
    res.status(200).json({message:'DONE',brand})
})
export const deletebrand=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const brandExist=await BrandModel.findByIdAndDelete(id)
    if(!brandExist){
        return next (new Error("IN_VALID BRAND ID",{cause:400}))
    }
    const categoryExist=await categoryModel.findById(brandExist.categoryID)
    const subcategoryExist=await SubCategoryModel.findById(brandExist.subcategoryID)
    //delete related products
    const RelatedProducts=await productModel.deleteMany({brandID:id})
    if(!(RelatedProducts.deletedCount)){
        return next (new Error("FAILED TO DELETE RELATED PRODUCTS OR THERE WAS NO PRODUCTS IN THIS BRAND",{cause:400}))
    }
    //delete from the host
    await cloudinary.api.delete_resources_by_prefix(
        `E-Commerce/Category/${categoryExist.customID}/SubCategory/${subcategoryExist.customID}/brand/${brandExist.customID}`
    )
    await cloudinary.api.delete_folder(
        `E-Commerce/Category/${categoryExist.customID}/SubCategory/${subcategoryExist.customID}/brand/${brandExist.customID}`
    )
    res.status(200).json({message:"DELETED SUCCESS!",DeletedBrand:brandExist})

})
