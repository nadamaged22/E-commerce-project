import { Router } from "express";
import * as pc from '../wishlist/controller/wishlist.js'
import { auth } from "../../middleware/auth.js";
import { endpoints } from "./wishlist.endpoint.js";


const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"WishList Module"})
})
router.patch('/addtowishlist/:productID',auth(endpoints.WishListCrud),pc.addtoWishList)
router.get('/getwishlist',auth(endpoints.WishListCrud),pc.getUserWishList)
router.delete('/deletefromwishlist/:productID',auth(endpoints.WishListCrud),pc.deleteFromWishList)


export default router