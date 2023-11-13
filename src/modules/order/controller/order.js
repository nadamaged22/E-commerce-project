import { CartModel } from "../../../../DB/model/cart.model.js";
import { CuponModel } from "../../../../DB/model/cupon.model.js";
import { orderModel } from "../../../../DB/model/order.model.js";
import { productModel } from "../../../../DB/model/product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.StripeKey);
export const addorder=asyncHandler(async(req,res,next)=>{
    let{products,address,phone,notes,Cupon,paymentMethod}=req.body
    const cart=await CartModel.findOne({UserId:req.user._id})
    if(!products){
        products=cart.products
        if(!products.length){
            return next(new Error('CART IS EMPTY!',{cause:404}))
    
        }
    }
    //check on cupon
    if(Cupon){
        const cuponExist=await CuponModel.findOne({code:Cupon})
        if(!cuponExist){
            return next (new Error("CUPON NOT FOUND !",{cause:404}))

        }
        if(cuponExist.EXPDate<Date.now()||cuponExist.numofUses<=cuponExist.UsedBy.length){
            return next(new Error("CUPON EXPIRED!",{cause:403}))

        }
        if(cuponExist.UsedBy.includes(req.user._id)){
            return next(new Error("YOU ALREADY USED THIS CUPON BEFORE!",{cause:400}))
        }
        req.body.Cupon=cuponExist
    }
    //to get the product i sent the id of it
    const existedProducts=[]
    const foundedIdS=[]//array htkon 4ayla al products 2ly la2ytha 3l4an amsa7ah
    const arrayforStock=[]
    let price=0
    for(const product of products){
        const checkProduct=await productModel.findById(product.product)
        if(!checkProduct){
            return next(new Error(`PRODUCT ${product.product}NOT FOUND`,{cause:404}))
        }
        if(checkProduct.stock< product.quantity){
            return next(new Error(`PRODUCT ${product.product} OUT OF STOCK`,{cause:404}))
        } 
        //ana hna m4 h3ml push 8yr lma kol al products tkon salyma
        existedProducts.push({
            product:{//to see the old orders i alraedy recieved 
                name:checkProduct.name,
                price:checkProduct.price,
                paymentPrice:checkProduct.priceAfterDiscount,
                productID:checkProduct._id
            },
            quantity: product.quantity
        })
        foundedIdS.push(checkProduct.id)
        arrayforStock.push({product:checkProduct,quantity:product.quantity}) //7atyt al products 2ly ana 3amltlha order bl data bta3tha kolha
        price+=(checkProduct.priceAfterDiscount *product.quantity)//dh hykon 4ayl kol al payment price bta3 kol al products y3ny al payment price hwa s3r al montg al wa7d w al price dh 4ayl s3r kol al products
        // checkProduct.stock=  checkProduct.stock-product.quantity
    }
    for(const product of arrayforStock){ // gyt hna 5ragt al stock bta3 kol product wn2ast mno al quantity b3d ma 3amlt al order 5las

        product.product.stock=product.product.stock-product.quantity
        await product.product.save()
    }

    
    const order=await orderModel.create({
        UserId:req.user._id,
        address,phone,notes,
        CuponID:req.body.Cupon?._id ,//lw fy cupon hy5zn lw la 5las
        paymentMethod,
        status:paymentMethod=='Card'?'waitPayment':'Placed', //hna ana b2olo lw l2yt mb3otlk card 5alyha waitpayment 8yr kda 5alyha placed
        products:existedProducts,
        price,
        paymentPrice:(price-(price*((req.body.Cupon?.amount||0)/100)))

    })

    //use stripe for payment
    if(paymentMethod=='Card'){
        if(req.body.Cupon){
            const cupon=await stripe.coupons.create({percent_off:req.body.Cupon.amount,duration:"once"})//kda ana b3ml create l cupon mn stripe 4ayl nafs al kyma 2ly b7otha fy al cupon 2ly 3andy w al duration mara wa7da
            req.body.StripeCupon=cupon.id //ana h3ml overide 3ala al id 2ly 3andy bl id 2ly gayly mn stripe
        }
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],//aih no3 al payment 2ly 3andy
            mode:"payment",//3yzah payment wla subsecription wla aih bzbt
            customer_email:req.user.email,
            metadata:{
                orderId:order._id.toString()//lazzm n7awlo l string 3l4an yt2ry 3andy bara
            },//any data i want it to transfer from one place to another
            cancel_url:process.env.cancel,//api ana b3mlo fyh al logic bta3 al cancelling order
            success_url:process.env.success,//api ana b3mlo lma al payment tkml
            discounts:req.body.StripeCupon? [{coupon:req.body.StripeCupon}]:[],//hna ana h7ot al discount bta3y 2ly bygyly mn al copun 2ly ana b7oto,hst5dm al cupon bt3 stripe ,kda ana b2olo lw galk cupon  lw mgalk4 sybha array fadya
            line_items:existedProducts.map(element=>{
                return{
                    
                      price_data:{
                            currency:'EGP',
                            product_data:{
                                name:element.product.name
                            },
                            unit_amount:(element.product.paymentPrice)*100,//s3r kol product
        
                        }//al45s dh bydf3 b2y 3omla wb3dyn ba5od al 3omla dy 27wlha ll7aga 2ly 3ayza ast2bl byha
                        ,quantity:element.quantity,
                        
                        
                    
                }
            }) //kol ma y5os al product
        })
        if(req.body.Cupon){//dh cupon bta3 kolo swa2 daf3 cash aw card bs fy 7alt al card al stripe m4 by2bl 8yr al cupons 2ly hwa 3amlha
            await CuponModel.updateOne({code:req.body.Cupon.code},{
                $addToSet:{
                    UsedBy:req.user._id
                }
            })
    
        }
        return res.status(200).json({message:'DONE',order,url:session.url})

    }
    if(req.body.products){
        await CartModel.updateOne({UserId:req.user._id},{
            $pull:{
                products:{
                    product:{
                        $in:foundedIdS
                    }
                }
            }
        })


    }else{
        
        await CartModel.updateOne({UserId:req.user._id},{products:[]})
    }

    if(req.body.Cupon){//dh cupon bta3 kolo swa2 daf3 cash aw card bs fy 7alt al card al stripe m4 by2bl 8yr al cupons 2ly hwa 3amlha
        await CuponModel.updateOne({code:req.body.Cupon.code},{
            $addToSet:{
                UsedBy:req.user._id
            }
        })

    }

    return res.status(201).json({message:"DONE",order})

})
 export const webhook=asyncHandler(async(req,res,next)=>{
        const sig = req.headers['stripe-signature'];
      
        let event;
      
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
        } catch (err) {
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
      
        // Handle the event
        switch (event.type) {
          case 'checkout.session.completed':
            const order=await orderModel.findByIdAndUpdate(event.data.object.metadata.orderId,{
                status:'Placed'
            },{
                new:true
            })
           res.json({order})
            break;
          // ... handle other event types
          default:
           res.json({message:"IN_VALID PAYMENT!"})
        }
      
        // Return a 200 response to acknowledge receipt of the event
     
 })
 export const cancelorder=asyncHandler(async(req,res,next)=>{
    const UserId=req.user._id
    const orderId=req.params.id
    const order=await orderModel.findById(orderId)
    //case where i cant cancel the order
if((order.paymentMethod=='Card'&& order.status !='waitPayment')||(order.paymentMethod=='cash' && order.status=='Delivered')){
    return next (new Error ('THIS ORDER CAN NOT BE CANCELLED!',{cause:409}))
}
//make a loop to return each product 3ala al 7ala 2ly kan 3alyha abl ma a3ml order
for(const product of order.products){
    await productModel.updateOne({
        _id:product.product.productID //kda hymsk al product dh ybd2 y3mlo update
    },{
         //dy bt3ml increment ,hst5dmha 3l4an azawd 3dd al7aga 2ly ats7bt fy al quantity 27otha fy al stock
        $inc :{
            stock:product.quantity

        }       

    })
}
//h4of lw ast5dm cupon h4ylo b22 mn al usedby array
if(order.CuponID){
    await CuponModel.updateOne({_id:order.CuponID},{
        $pull:{
            UsedBy:UserId //kda b2olo y4yl mn al array bt3 al usedby y4yl mno al user 2ly hy3ml match
        }
    })
}
order.status='canceled'
await order.save()
res.status(200).json({message:"ORDER CANCELEATION SUCCESS!",order})

 })