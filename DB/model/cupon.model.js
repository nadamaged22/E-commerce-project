import { model, Schema, Types } from 'mongoose';


const CuponSchema = new Schema({
    code: { type: String, required: true ,unique:true,lowercase:true},
    amount:{type:Number,required:true,min:0,max:100},
    EXPDate:{type:Date,required:true,min:Date.now()},
    numofUses:{type:Number},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    UsedBy:[{ type: Types.ObjectId, ref: 'User', required: true }],//to do after create user,
   
}, 
{
    timestamps: true,
    
})


export const CuponModel = model('Cupon', CuponSchema)
