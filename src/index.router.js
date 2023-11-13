import connectDB from '../DB/connection.js'
import authRouter from './modules/auth/auth.router.js'
import branRouter from './modules/brand/brand.router.js'
import cartRouter from './modules/cart/cart.router.js'
import categoryRouter from './modules/category/category.router.js'
import couponRouter from './modules/coupon/coupon.router.js'
import orderRouter from './modules/order/order.router.js'
import productRouter from './modules/product/product.router.js'
import reviewsRouter from './modules/reviews/reviews.router.js'
import subcategoryRouter from './modules/subcategory/subcategory.router.js'
import WishListRouter from './modules/wishlist/wishlist.router.js'
import userRouter from './modules/user/user.router.js'
import { globalErrorHandling } from './utils/errorHandling.js'
import { fileURLToPath } from "url" //dh bardo 3l4an ysa3dny fy 7war al path
import path from 'path'
const __dirname=path.dirname(fileURLToPath(import.meta.url)) 



const initApp = (app, express) => {
    //convert Buffer Data
    app.use((req,res,next)=>{
        if(req.originalUrl=='/order/webhook'){
            next()
        }else{
            express.json()(req,res,next)
        }
    })
    //Setup API Routing 
    app.use(`/auth`, authRouter)
    app.use(`/user`, userRouter)
    app.use(`/product`, productRouter)
    app.use(`/category`, categoryRouter)
    app.use(`/subCategory`, subcategoryRouter)
    app.use(`/reviews`, reviewsRouter)
    app.use(`/coupon`, couponRouter)
    app.use(`/cart`, cartRouter)
    app.use(`/order`, orderRouter)
    app.use(`/brand`, branRouter)
    app.use(`/wishList`, WishListRouter)

    app.all('*', (req, res, next) => {
        res.send("In-valid Routing Plz check url  or  method")
    })
    app.use(globalErrorHandling)
    app.use("/uploads",express.static(path.join(__dirname,'../uploads')))

    connectDB()

}



export default initApp