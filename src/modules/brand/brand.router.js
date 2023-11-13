import { Router } from "express";
import { fileValidation, fileupload } from "../../utils/multer.js";
import * as pc from '../brand/controller/brand.js'
import { validation } from "../../middleware/validation.js";
import * as validators from '../brand/brand.validation.js'
import { idVal } from "../globalValidation.js";
import { endpoints } from "./brand.endPoint.js";
import { auth } from "../../middleware/auth.js";
// import auth from "../../middleware/auth.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Brand Module"})
})

router.post('/create',auth(endpoints.brandCrud),fileupload(fileValidation.image).single('image'),validation(validators.createbrand),pc.addbrand)
router.put('/update/:brandId',auth(endpoints.brandCrud),fileupload(fileValidation.image).single('image'),validation(validators.updateBrand),pc.updateBrand)
router.get('/getbyid/:id',validation(idVal),pc.getbrandbyid)
router.delete('/delete/:id',auth(endpoints.brandCrud),validation(idVal),pc.deletebrand)
router.get('/getall',pc.getallbrands)

export default router