import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import * as validators from '../subcategory/subcategory.validation.js'
import * as pc from '../subcategory/controller/subcategory.js'
import { fileValidation, fileupload } from "../../utils/multer.js";
import { idVal } from "../globalValidation.js";

import { endpoints } from "./subcategory.endPoint.js";
import { auth } from "../../middleware/auth.js";
const router = Router({mergeParams:true}) //this enable me to add subcategory using the category




router.get('/', (req ,res)=>{
    res.status(200).json({message:"SubCategory Module"})
})
router.post('/',auth(endpoints.subcategoryCrud),fileupload(fileValidation.image).single('image'),validation(validators.createSubCategory),pc.createsubcategory)
router.get('/getbyid/:id',validation(idVal),pc.getSubcategorybyID)
router.put('/update/:subcategoryID',auth(endpoints.subcategoryCrud),fileupload(fileValidation.image).single('image'),validation(validators.updateSubCategory),pc.updateSubCategory)
router.delete('/delete/:id',auth(endpoints.subcategoryCrud),validation(idVal),pc.deletesubcategory)
router.get('/getall',pc.getAllSubcategories)


export default router