import slugify from "slugify";
import { categoryModel } from "../../../../DB/model/Category.model.js";
import { SubCategoryModel } from "../../../../DB/model/SubCategory.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import cloudinary from "../../../utils/cloudinary.js";
import { customAlphabet } from "nanoid";
import { BrandModel } from "../../../../DB/model/Brand.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { paginationfunction } from "../../../utils/pagination.js";
const nanoid=customAlphabet('1123456!=abcderfg ',5)

export const createsubcategory=asyncHandler(async(req,res,next)=>{
    const{name}=req.body
    const{categoryID}=req.params
    const userId=req.user._id
    const category=await categoryModel.findById(categoryID)
    //check category id exist or not
    if(!category){
        return next (new Error ("CATEGORY NOT EXIST!",{cause:400}))
    }
    //check if name is unique
    if(await SubCategoryModel.findOne({name})){
        return next (new Error("THIS NAME ALREADY EXIST!",{cause:409}))
    }
    const slug=slugify(name,"_")
    if(!req.file){
        return next(new Error("PLEASE UPLOAD A SUBCATEGORY PHOTO!",{cause:400}))
    }
    const customID=nanoid()
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`E-Commerce/Category/${category.customID}/SubCategory/${customID}/Subcategoryphoto`})
    const subcategoryObject={
        name,
        slug,
        image:{
            secure_url,
            public_id,
        },
        categoryID,
        customID,
        createdBy:userId
    }
    const SubCategory=await SubCategoryModel.create(subcategoryObject)
   if(!SubCategory){
    await cloudinary.uploader.destroy(public_id)
    return next(new Error ("TRY AGAIN LATER! FAILED TO ADD SUBCATEGORY",{cause:400}))//b3ml kda 3l4an lw al sora mtrf3t4 y3ml catch wy3rf ano 7asl mo4kla fy al upload
   }
   res.status(201).json({message:"ADDED SUCCESS!",SubCategory})
})
export const updateSubCategory=asyncHandler(async(req,res,next)=>{
    const {subcategoryID}=req.params
    const{name}=req.body
    const {categoryID}=req.query
    // const customID=nanoid()
    const subcategory=await SubCategoryModel.findById(subcategoryID)
    if(!subcategory){
        return next (new Error ("IN_VALID SUBCATEGORY ID",{cause:400}))
    }
    const category=await categoryModel.findById(categoryID||subcategory.categoryID)
    if(categoryID){ //lw atb3tlk categoryid gdyd
        if(!category){
            return next (new Error ("IN_VALID CATEGORY ID",{cause:400}))
        }
        subcategory.categoryID=categoryID
    }
    if(name){
        if(subcategory.name==name){
            return next (new Error ("PLEASE ENTER DIFF NAME FROM THE OLD ONE",{cause:409}))
        }
        if(await SubCategoryModel.findOne({name})){
            return next (new Error("SUBCATEGORY NAME ALREADY EXIST!",{cause:409}))
        }
        subcategory.name=name
        subcategory.slug=slugify(name,"_")
    }
    if(req.file){
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`E-Commerce/Category/${category.customID}/SubCategory/${subcategory.customID}/Subcategoryphoto`})
        const subcategoryPhoto=await SubCategoryModel.findByIdAndUpdate(subcategoryID,
            { image:{secure_url,public_id}},{new:false})//h3ml new b false 3l4an t5aznly al nos5a al 2adyma mn al id bt3 al sora wb3dyn 22dr amsa7o
            await cloudinary.uploader.destroy(subcategoryPhoto.image.public_id)
    }
    await subcategory.save()
    res.status(200).json({message:"UPDATED SUCCESS!",subcategory})
    
})
export const getSubcategorybyID=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const subCategory=await SubCategoryModel.findById(id).populate([{
        path:"categoryID",
        select:"name"
    }])
    if(!subCategory){
        return next(new Error("IN_VALID SUBCATEGORY ID",{cause:400}))
    }
    res.status(200).json({message:"DONE",subCategory})
})

export const getAllSubcategories=asyncHandler(async(req,res,next)=>{ //get all subcategories with related brands and related product to that brand
    const mongoseQuery= SubCategoryModel.find().populate([{
        path:'Brand',
        select:'name',
        populate:[{
            path:'product',
            selectt:'name'

        }]
    }])
    const apiFeatures=new ApiFeatures(mongoseQuery,req.query).fields().filter().search().sort()
    const {page,size}=req.query
    const {limit,skip}=paginationfunction({page,size})
    mongoseQuery.skip(skip).limit(size)
    const subCategories=await apiFeatures.mongoseQuery
    res.status(200).json({message:'DONE',subCategories})
})
export const deletesubcategory=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const subcategoryExist=await SubCategoryModel.findByIdAndDelete(id)
    const categoryExist=await categoryModel.findById(subcategoryExist.categoryID)
    if(!subcategoryExist){
        return next (new Error ("IN_VALID SUBCATEGORY ID",{cause:400}))
    }
    //delete from the host
    await cloudinary.api.delete_resources_by_prefix(
        `E-Commerce/Category/${categoryExist.customID}/SubCategory/${subcategoryExist.customID}`
    )
    await cloudinary.api.delete_folder(
        `E-Commerce/Category/${categoryExist.customID}/SubCategory/${subcategoryExist.customID}`
        )
        //delete related brands
        const RelatedBrands=await BrandModel.deleteMany({subcategoryID:id})
        //check that all the related items deleted success
        if(!(RelatedBrands.deletedCount)){
            return next (new Error("FAILED TO DELETE RELATED BRANDS OR THERE WAS NO BRANDS IN THIS SUBCATEGORY",{cause:400}))
        }
    //delete related products
    const RelatedProducts=await productModel.deleteMany({subcategoryID:id})
    if(!(RelatedProducts.deletedCount)){
        return next (new Error("FAILED TO DELETE RELATED PRODUCTS OR THERE WAS NO PRODUCTS IN THIS SUBCATEGORY",{cause:400}))
    }
    res.status(200).json({message:"DELETED SUCCESS!",DeletedSubCategory:subcategoryExist})
})