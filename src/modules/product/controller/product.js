import slugify from "slugify";
import { BrandModel } from "../../../../DB/model/Brand.model.js";
import { categoryModel } from "../../../../DB/model/Category.model.js";
import { SubCategoryModel } from "../../../../DB/model/SubCategory.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { customAlphabet } from "nanoid";
import { paginationfunction } from "../../../utils/pagination.js";
import QRCode from 'qrcode'
import { ApiFeatures } from "../../../utils/apiFeatures.js";
const nanoid=customAlphabet('1123456!=abcderfg ',5)


export const addproduct=asyncHandler(async(req,res,next)=>{
    //check if the name of the product already exist count+1 on the stock
    const isNameExist=await productModel.findOne({name:req.body.name}) //lw l2yt al2sm 2ly gylk fy al body dh 3andk fy al DB
    if(isNameExist){
        //hb3t al quantity dy fy al body bs m4 ho7tha fy al model hzawd al quantity f=dy 3ala al stock
        isNameExist.stock +=parseInt(req.body.quantity) //lw al name dh mawgod zawd al quantity bt3to
        await isNameExist.save()
        return res.status(200).json({message:"PRODUCT ADDED SUCCESS!",product:isNameExist})
    }
    //lw al name dh m4v mawgod abl kda
    const iscategoryExist=await categoryModel.findById(req.body.categoryID)
    if(!iscategoryExist){
        return next(new Error("IN_VALID CATEGORY ID",{cause:400}))
    }
    const isSubcategoryExist=await SubCategoryModel.findById(req.body.subcategoryID)
    if(!isSubcategoryExist){
        return next(new Error("IN_VALID SUBCATEGORY ID",{cause:400}))

    }
    const isBrandExist=await BrandModel.findById(req.body.brandID)
    if(!isBrandExist){
        return next (new Error("IN_VALID BRAND ID",{cause:400}))
    }
    req.body.slug=slugify(req.body.name,'_')
    if(req.body.quantity){
        req.body.stock=req.body.quantity //kda al product dh m4 mawgod fa h7ot al qunatity 2ly ana b3taha fy al body h7otha fy al stock al stock dh gwa al model lkn al quantity la
        //lw galk discount
    }
    req.body.priceAfterDiscount=req.body.price-req.body.price*((req.body.appliedDiscount||0)/100)
    const customID=nanoid()
    req.body.customID=customID

    //upload photo array on cloudinary
    if(!(req.files.image)){
        return next (new Error ("PLEASE UPLOAD PRODUCT IMAGE!",{cause:400}))
    }
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.image[0].path,{folder: `E-Commerce/Category/${iscategoryExist.customID}/SubCategory/${isSubcategoryExist.customID}/brand/${isBrandExist.customID}/products/${customID}/image`})
    req.body.image={secure_url,public_id}
    if(req.body.sizes){
        req.body.sizes=JSON.parse(req.body.sizes)
    }
    if(req.body.colors){
        req.body.colors=JSON.parse(req.body.colors)
    }
    const coverImages=[]
    const publicids=[]
    if(req.files.coverImages?.length){
    for(const file of req.files.coverImages ){
        const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder: `E-Commerce/Category/${iscategoryExist.customID}/SubCategory/${isSubcategoryExist.customID}/brand/${isBrandExist.customID}/products/${customID}/coverImages`})
        coverImages.push({secure_url,public_id})
        publicids.push({public_id}) //3l4an lw 7asal 2y mo4kla 23rf amsa7
    }
    req.body.coverImages=coverImages
    }
    req.body.QRcode=await QRCode.toDataURL(JSON.stringify({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        priceAfterDiscount:req.body.priceAfterDiscount,
        image:req.body.image
    }))
    req.body.createdBy=req.user._id

    const product=await productModel.create(req.body)
    if(!product){
        await cloudinary.api.delete_resources(publicids)
        return next(new Error("PRODUCT UPLOADING FAILIED!",{cause:400}))
    }
    res.status(201).json({message:"PRODUCT ADDED SUCCESS!",product})
})

export const updateproduct=asyncHandler(async(req,res,next)=>{

   const product=await productModel.findById(req.params.productID)
   if(!product){
    return next(new Error ("PRODUCT NOT FOUND!",{cause:400}) )
   }
  const categoryExist=await categoryModel.findById(req.body.categoryID|| product.categoryID) //hna ana h5lyh y3ady 3ala kol al await 7ata lw awl wa7da 3amlt fail wm3 zalk hagy fy al if 2ly t7t w b2olo atl3 mn awl wa7da faylt f al mafrod 2afslhom
   if(req.body.categoryID){
        if(!categoryExist){
            return next (new Error("IN_VALID CATEGORY ID",{cause:400}))
        }
        product.categoryID=req.body.categoryID //update the old one with the new one to be then saved in the database
   }
   const SubcategoryExist=await SubCategoryModel.findById(req.body.subcategoryID||product.subcategoryID)
   if(req.body.subcategoryID){
       if(!SubcategoryExist){
           return next (new Error("IN_VALID SubCATEGORY ID",{cause:400}))
       }
       product.subcategoryID=req.body.subcategoryID
   }
   const brandExist=await BrandModel.findById(req.body.brandID || product.brandID)
   if(req.body.brandID){
       if(!brandExist){
           return next (new Error("IN_VALID Brand ID",{cause:400}))
       }
       product.brandID=req.body.brandID
   }
    //if the edits are for price and applied discunt
    if(req.body.appliedDiscount && req.body.price){
        const priceAfterDiscount= req.body.price- req.body.price*((req.body.appliedDiscount||0)/100)
        product.price=req.body.price
        product.appliedDiscount=req.body.appliedDiscount
        product.priceAfterDiscount=priceAfterDiscount
    }
    //lw hwa talb y3adl al price bs yb2a al discount hyfdal zy al adym
    else if(req.body.price){
        const priceAfterDiscount=req.body.price-req.body.price*((product.appliedDiscount||0)/100)
        product.price=req.body.price
        product.priceAfterDiscount=priceAfterDiscount
    }
    //lw hwa hy3adl al discount bs yb2a al price hyfdal zy ma hwa
    else if(req.body.appliedDiscount){
        const priceAfterDiscount=product.price-product.price*((req.body.appliedDiscount||0)/100)
        product.priceAfterDiscount=priceAfterDiscount
        product.appliedDiscount=req.body.appliedDiscount
    }
    const coverImages=[] //hold new photos
    if(req.files.coverImages?.length){
        for(const file of req.files.coverImages){
            const{secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder: `E-Commerce/Category/${categoryExist.customID}/SubCategory/${SubcategoryExist.customID}/brand/${brandExist.customID}/products/${product.customID}/coverImages`})
            coverImages.push({secure_url,public_id})
        }
        let public_ids=[]//hold old images
        for(const image of product.coverImages){
            public_ids.push(image.public_id)
        }
        await cloudinary.api.delete_resources(public_ids)
        product.coverImages=coverImages
    }
    if(req.files.image){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.image[0].path,{folder: `E-Commerce/Category/${categoryExist.customID}/SubCategory/${SubcategoryExist.customID}/brand/${brandExist.customID}/products/${product.customID}/image`})
    const productPhoto=await productModel.findByIdAndUpdate(req.params.productID,
        {image:{secure_url,public_id}},{new:false}
        )
        await cloudinary.uploader.destroy(productPhoto.image.public_id)
    }
    if(req.body.name){
        if(product.name==req.body.name){
            return next (new Error ("PLEASE ENTER DIFF NAME FROM THE OLD ONE",{cause:409}))
        }
        product.name=req.body.name
        product.slug=slugify(req.body.name,"_")
    }
    if(req.body.sizes){
        product.sizes=JSON.parse(req.body.sizes)
    }
    if(req.body.colors){
        product.colors=JSON.parse(req.body.colors)
    }
    if(req.body.description){
        product.description=req.body.description
    }
    if(req.body.quantity){
        product.stock=req.body.quantity
    }
    await product.save()
    return res.status(200).json({message:"UPDATED SUCCESS!",product})

})

export const getallproducts=asyncHandler(async(req,res,next)=>{
    const mongoseQuery=productModel.find() //tlama m3mlt4 await hy5zn al data gwa al mongosequery dy w awl ma a3ml await hyrg3ly al data kolha
    const apiFeatures=new ApiFeatures(mongoseQuery,req.query).filter().sort().fields().search()
    const {page,size}=req.query
    const {limit,skip}=paginationfunction({page,size})
    mongoseQuery.skip(skip).limit(size)
    const products=await apiFeatures.mongoseQuery//al class dh fy 7agat kter mn gwa fa ana 2oltlo ana 3ayza al mongose t7dydn
    return res.status(200).json({message:"DONE",products})
})
export const getproductbyid=asyncHandler(async(req,res,next)=>{
    const {id}=req.params
    const products=await productModel.findById(id).populate([{
        path:"categoryID",
        select:"name"
    }])
    if(!products){
        return next (new Error("IN_VALID PRODUCT ID"))
    }
    res.status(200).json({message:"DONE",products})


})
export const deleteproduct=asyncHandler(async(req,res,next)=>{
    const{id}=req.params
    const productExist= await productModel.findByIdAndDelete(id)
    if(!productExist){
        return next(new Error("IN_VALID PRODUCT ID!",{cause:400}))
    }
    const categoryExist=await categoryModel.findById(productExist.categoryID)
    const SubcategoryExist=await SubCategoryModel.findById(productExist.subcategoryID)
    const brandExist=await BrandModel.findById(productExist.brandID)
    await cloudinary.api.delete_resources_by_prefix(
        `E-Commerce/Category/${categoryExist.customID}/SubCategory/${SubcategoryExist.customID}/brand/${brandExist.customID}/products/${productExist.customID}`
    )
    await cloudinary.api.delete_folder(
        `E-Commerce/Category/${categoryExist.customID}/SubCategory/${SubcategoryExist.customID}/brand/${brandExist.customID}/products/${productExist.customID}`
    )
    res.status(200).json({message:"DELETED SUCCESS!",DeletedProduct:productExist})


})