import { asyncHandler } from "../../../utils/errorHandling.js";
import slugify from "slugify";
import cloudinary from "../../../utils/cloudinary.js"
import { categoryModel } from "../../../../DB/model/Category.model.js";
// import { SubCategoryModel } from "../../../../DB/model/SubCategory.model.js";
import { customAlphabet } from "nanoid";
import { populate } from "dotenv";
import { SubCategoryModel } from "../../../../DB/model/SubCategory.model.js";
import { BrandModel } from "../../../../DB/model/Brand.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { ApiFeatures } from "../../../utils/apiFeatures.js";
import { paginationfunction } from "../../../utils/pagination.js";
const nanoid=customAlphabet('1123456!=abcderfg ',5)


export const createcategory=asyncHandler(async(req,res,next)=>{
    const{name}=req.body
    const userId=req.user._id
    const slug=slugify(name,'_')
    if(await categoryModel.findOne({name})){
        return next (new Error("CATEGORY NAME ALREADY EXIST!"),{cause:400})
    }
    if(!req.file){
        return next(new Error("PLEASE UPLOAD A CATEGORY PHOTO!"))
    }
    const customID=nanoid()
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`E-Commerce/Category/${customID}/categoryphoto`})
   const categoryObject={
    name,slug,image:{
        secure_url,
        public_id,
    },
    customID,
    createdBy:userId
   }
   const category=await categoryModel.create(categoryObject)
   if(!category){
    await cloudinary.uploader.destroy(public_id)
    return next(new Error ("TRY AGAIN LATER! FAILED TO ADD CATEGORY",{cause:400}))//b3ml kda 3l4an lw al sora mtrf3t4 y3ml catch wyrh3 ano 7asl mo4kla fy al upload
   }
   res.status(200).json({message:"ADDED SUCCESS!",category})

})
export const updatecategory=asyncHandler(async(req,res,next)=>{
    //check by id category already exist
    const {categoryID}=req.params
    const{name}=req.body
    const customID=nanoid()
    const category=await categoryModel.findById(categoryID)
    if(!category){
        return next (new Error ("Invalid_CategoryID",{cause:400}))
    }
    //check if new name diff from old name
    if(name)//if the req to update is name
    {
        if(category.name==name){
            return next (new Error("PLEASE ENTER DIFF NAME FROM THE OLD NAME",{cause:409}))
        }
        //check if the name is unique in database
        if(await categoryModel.findOne({name})){
            return next (new Error("CATEGORY NAME ALREADY EXIST!"),{cause:409})
        }
        category.name=name
        category.slug=slugify(name,"_")
    }
    if(req.file)//if the required to update is photo
    {
        //upload a new photo then delete the old one
        const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`E-Commerce/Category/${category.customID}/categoryphoto`})
        const categoryphoto=await categoryModel.findByIdAndUpdate(categoryID,
            { image:{secure_url,public_id}},{new:false})//h3ml new b false 3l4an t5aznly al nos5a al 2adyma mn al id bt3 al sora wb3dyn 22dr amsa7o
             await cloudinary.uploader.destroy(categoryphoto.image.public_id)
    }
    await category.save()
    res.status(200).json({message:"UPDATED SUCCESS!",category})

})
export const getAllcategories=asyncHandler(async(req,res,next)=>{
    const mongoseQuery= categoryModel.find().populate([{
        path:'SubCategories',
        select:'name',
        populate:[{
            path:'Brand',
            select:'name'

        }
        ]
    }])
    const apiFeatures=new ApiFeatures(mongoseQuery,req.query).fields().filter().search().sort()
    const {page,size}=req.query
    const {limit,skip}=paginationfunction({page,size})
    mongoseQuery.skip(skip).limit(size)
    const categories=await apiFeatures.mongoseQuery
    res.status(200).json({message:'DONE',categories})
})
export const deletecategory=asyncHandler(async(req,res,next)=>{
    //find if category id exist
    const {id}=req.params
    const categoryExist=await categoryModel.findByIdAndDelete(id)
    if(!(categoryExist)){
        return next (new Error('IN_VALID CATEGORY ID!',{cause:400}))
    }
    //to delete items from host
    //delete all the photos in this path
    await cloudinary.api.delete_resources_by_prefix(
        `E-Commerce/Category/${categoryExist.customID}`
    )
        //delete the folder its self
    await cloudinary.api.delete_folder(
        `E-Commerce/Category/${categoryExist.customID}`
        )
        
    //delete related brand
    const RelatedBrands=await BrandModel.deleteMany({categoryID:id})
    //delete related products
    const RelatedProducts=await productModel.deleteMany({categoryID:id})
    const RelatedSubCategories=await SubCategoryModel.deleteMany({categoryID:id})
    if(!RelatedSubCategories.deletedCount){
        return next (new Error('FAILED TO DELETE RELATED SUBCATEGORIES',{cause:400}))
    }
    //check that all the related items successfully deleted
        if(!RelatedBrands.deletedCount){
            return next (new Error('FAILED TO DELETE RELATED BRANDS OR THERE WAS NO BRANDS IN THIS CATEGORY',{cause:400}))
        }
        if(!RelatedProducts.deletedCount){
            return next (new Error('FAILED TO DELETE RELATED PRODUCTS OR THERE WAS NO PRODUCTS IN THIS CATEGORY',{cause:400}))
        }
        res.status(200).json({message:"DELETED SUCCESS!",DeletedCategory:categoryExist})
        //delete related subcategories
})
    
export const getCategoryByID=asyncHandler(async(req,res,next)=>{
            const{id}=req.params
            const categories=await categoryModel.findById(id).populate([{
                path:'SubCategories'
            }])
            if(!categories){
                return next (new Error("IN_VALID ID"))
            }
            res.status(200).json({message:"DONE",categories})
        })



















        //     let subCategories=[]
        //     let categoryArr=[]
        // const cursor = await categoryModel.find().cursor()
        // //cursor.next() ano lw fy doc tany ynzl ykml
        // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        //     subCategories=await SubCategoryModel.find({
        //         categoryID:doc._id //3ayza agyb kol al subcategory bt3 al category 2ly ana w2fa fyha ,w2ly rabthom bb3d hwa al id 
        //         //bygyb kol al categories b3dyn by2of 3and kol category doc wy4of al subcategory bt3aha 3an try2 al category id 2ly mt5azn gwa al sub category
        
        //     })
        //     const objectCategory=doc.toObject() //do this to make the array of sub category get to every category its responsiple to ,y3ny kol category t7tyh aih subcategory bzbt
        //     objectCategory.subCategories=subCategories
        //     categoryArr.push(objectCategory) //b7ot al dataobject dy gwa array wdh hwa 2ly ana hrg3o,bykon al final 2ly 4ayl al category whya m3aha al subcategory
        
        // }