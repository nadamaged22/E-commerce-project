import express,{ Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as pc from './controller/order.js'
import { endpoints } from "./order.endPoint.js";
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"order Module"})
})
router.post('/create',auth(endpoints.OrderCrud),pc.addorder)
router.patch('/cancel/:id',auth(endpoints.OrderCrud),pc.cancelorder)

router.post('/webhook', express.raw({type: 'application/json'}),pc.webhook)






export default router