import { model, Schema, Types } from 'mongoose';


const subcategorySchema = new Schema({
    name: { type: String, required: true ,unique:true,lowercase:true},
    slug: { type: String, required: true ,unique:true,lowercase:true },
    image:{secure_url:String,public_id:String},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },//to do after create user,
    categoryID:{type:Types.ObjectId,ref:'Category',required:true},
    customID:{type:String}
}, 
{
    timestamps: true,
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
})
subcategorySchema.virtual('Brand',{
    ref:'Brand',//will iterate on what collection
    foreignField:'subcategoryID',//al relation 2ly hm4y 3alyha 3l4an agyb al data mn al model al tany
    localField:'_id'//al field 2ly fy al collection dh marbot b aih fy 2ly ana wa2f 3ando dlw2ty
})

export const SubCategoryModel= model('SubCategory', subcategorySchema)
