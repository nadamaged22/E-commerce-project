
import { model, Schema, Types } from 'mongoose';


const categorySchema = new Schema({
    name: { type: String, required: true ,unique:true,lowercase:true},
    slug: { type: String, required: true ,unique:true,lowercase:true },
    image:{secure_url:String,public_id:String},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },//to do after create user,
    customID:{type:String}
}, 
{
    toObject:{virtuals:true},//lazm tt3ml 3l4an al result ysm3 wyrg3ly al child items (dh hyrg3ha fy al console)
    toJSON:{virtuals:true},//lazm 23mlha 3l4an al results tzhar 3andy fy al json b22
    timestamps: true
})
categorySchema.virtual('SubCategories',{
    ref:'SubCategory',//will iterate on what collection
    foreignField:'categoryID',//al relation 2ly hm4y 3alyha 3l4an agyb al data mn al model al tany
    localField:'_id'//al field 2ly fy al collection dh marbot b aih fy 2ly ana wa2f 3ando dlw2ty
})
export const categoryModel = model('Category', categorySchema)
