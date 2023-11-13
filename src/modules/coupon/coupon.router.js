import { Router } from "express";
import * as pc from './controller/coupon.js'
import { auth } from "../../middleware/auth.js";
import { endpoints } from "./coupon.endPoint.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Coupon Module"})
})
router.post('/create',auth(endpoints.cuponCrud),pc.createcupon)




export default router