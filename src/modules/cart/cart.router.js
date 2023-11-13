import { Router } from "express";
import * as pc from '../cart/controller/cart.js'

import { endpoints } from "./cart.endPoint.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validators from '../cart/cart.validation.js'
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Cart Module"})
})
router.post('/add',auth(endpoints.CartCrud),pc.AddToCart)
router.delete('/delete/:id',auth(endpoints.CartCrud),pc.deletefromCart)
router.get('/getusercart',auth(endpoints.CartCrud),pc.getUserCart)



export default router