import { model, Schema, Types } from 'mongoose';


const CartSchema = new Schema({
    UserId:{type: Types.ObjectId, ref: 'User', required: true,unique:true},
    products:[
        {
            product:{
                type: Types.ObjectId,
                 ref: 'Product', 
                 required: true //dy m4 ht4t8l 8yr lma y7ot product nafso yt3ml

            },
            quantity:{
                type:Number,
                required:true,
                default:1
            }
        }

    ],
   
    // createdBy: { type: Types.ObjectId, ref: 'User', required: true },//to do after create user,
    // subcategoryID:{type:Types.ObjectId,ref:'SubCategory',required:true},
    // categoryID:{type:Types.ObjectId,ref:'Category',required:true},
    // customID:{type:String} //momkn yb2a 3andy api a3ml get lkol al brand 2ly gwa category mo3ayna
}, 
{
    timestamps: true,
})


export const CartModel = model('Cart', CartSchema)
