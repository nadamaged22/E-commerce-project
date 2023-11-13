import { Router } from "express";
const router = Router()
import * as pc from '../product/controller/product.js'
import {fileupload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as validators from '../product/product.validation.js'
import { idVal } from "../globalValidation.js";

import { endpoints } from "./product.endPoint.js";
import { auth } from "../../middleware/auth.js";
router.get('/', (req ,res)=>{
    res.status(200).json({message:"product Module"})
})

router.post('/add',auth(endpoints.productCrud),fileupload(fileValidation.image).fields([{name:'image',maxCount:1},{name:'coverImages',maxCount:5}]),validation(validators.createproduct),pc.addproduct)
router.put('/update/:productID',auth(endpoints.productCrud),fileupload(fileValidation.image).fields([{name:'image',maxCount:1},{name:'coverImages',maxCount:5}]),validation(validators.updateproduct),pc.updateproduct)
router.get('/getbyid/:id',validation(idVal),pc.getproductbyid)
router.delete('/delete/:id',auth(endpoints.productCrud),validation(idVal),pc.deleteproduct)
router.get('/get',pc.getallproducts)

export default router