import { model, Schema, Types } from 'mongoose';


const OrderSchema = new Schema({
    UserId:{type: Types.ObjectId, ref: 'User', required: true},
    products:[
        {
            product:{//to see the old orders i alraedy recieved 
                name:{type:String,required:true},
                price:{ type:Number,required:true},
                paymentPrice:{ type:Number,required:true},
                productID:{
                    type:Types.ObjectId,
                    ref:'Product',
                    required:true
                }
            },
            quantity:{
                type:Number,
                required:true,
                default:1
            }
        }

    ],
    address:{type:String,required:true},
    phone:{type:String},
    notes:{type:String},
    CuponID:{
        type:Types.ObjectId,ref:'Cupon'
    },
    price:{
        type:Number,required:true
    },
    paymentPrice:{
        type:Number,required:true
    },
    paymentMethod:{
        type:String,
        enum:['cash','Card'],
        default:'cash'
    },
    status:{
        type:String,
        enum:['waitPayment','canceled','onRood','Delivered','Rejected','Placed'],
        default:'Placed'
    },
    reason:String
}, 
{
    timestamps: true,
})


export const orderModel = model('order', OrderSchema)
