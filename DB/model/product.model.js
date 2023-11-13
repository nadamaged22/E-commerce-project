
import { model, Schema, Types } from 'mongoose';
const ProductSchema = new Schema({
    // name: { type: String, required: true ,lowercase:true},
    name:{type:String,required:true,lowercase:true},
    description:{type:String,required:true},
    slug: { type:String,required:true,lowercase:true },
    colors:{type:Array},
    sizes:{type:Array},
    price:{type:Number,required:true,default:1},
    appliedDiscount:{type:Number,default:0},
    priceAfterDiscount:{type:Number,default:0},//payment price
    stock:{type:Number
        ,required:true,
        default:1
    },
    coverImages:[{type:Object}],
    image:{secure_url:{type:String,required:true},public_id:{type:String,required:true}},
    avgRate:{type:Number,default:0},
    sold:{type:Number,default:0},
    QRcode:{type:String,required:true},

    categoryID:{
        type:Types.ObjectId,
        ref:'Category',
        required:true
    },
    subcategoryID:{
        type:Types.ObjectId,
        ref:'SubCategory',
        required:true
    },
    brandID:{
        type:Types.ObjectId,
        ref:'Brand',
        required:true
    },
    customID:{type:String},
    createdBy:{ type:Types.ObjectId,
        ref:'User',
        required:true
    },
    wishlist:[{type:Types.ObjectId,
        ref:'User'}]
}, 
{timestamps:true})


export const productModel=model('Product',ProductSchema)