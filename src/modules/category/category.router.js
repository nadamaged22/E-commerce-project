import { Router } from "express";
import {fileupload, fileValidation } from "../../utils/multer.js";
import * as pc from '../category/controller/category.js'
import {validation} from '../../middleware/validation.js'
import * as validators from '../category/category.validation.js'
import subcategoryRouter from "../subcategory/subcategory.router.js";
import { idVal } from "../globalValidation.js";

import { endpoints } from "./category.endPoint.js";
import { auth } from "../../middleware/auth.js";
// import auth from "../../middleware/auth.js";
// import { auth } from '../../middleware/auth.js'
const router = Router()
router.use('/create/:categoryID',subcategoryRouter)
router.get('/', (req, res) => {
    res.status(200).json({ message: "category Module" })
})
router.post('/create',auth(endpoints.categoryCrud),fileupload(fileValidation.image).single("image"),validation(validators.createCategory),pc.createcategory)
router.put('/update/:categoryID',auth(endpoints.categoryCrud),fileupload(fileValidation.image).single("image"),validation(validators.updatecategory),pc.updatecategory)
router.delete('/delete/:id',auth(endpoints.categoryCrud),validation(idVal),pc.deletecategory)
router.get('/getbyid/:id',validation(idVal),pc.getCategoryByID)
router.get('/get',pc.getAllcategories)


export default router