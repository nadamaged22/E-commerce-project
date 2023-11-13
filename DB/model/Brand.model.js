import { model, Schema, Types } from 'mongoose';


const BrandSchema = new Schema({
    name: { type: String, required: true ,lowercase:true},
    slug: { type: String, required: true ,lowercase:true },
    logo:{secure_url:String,public_id:String},
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },//to do after create user,
    subcategoryID:{type:Types.ObjectId,ref:'SubCategory',required:true},
    categoryID:{type:Types.ObjectId,ref:'Category',required:true},
    customID:{type:String} //momkn yb2a 3andy api a3ml get lkol al brand 2ly gwa category mo3ayna
}, 
{
    timestamps: true,
    toObject:{virtuals:true},//lazm tt3ml 3l4an al result ysm3 wyrg3ly al child items (dh hyrg3ha fy al console)
    toJSON:{virtuals:true},
})
BrandSchema.virtual('product',{
    ref:'Product',//will iterate on what collection
    foreignField:'brandID',//al relation 2ly hm4y 3alyha 3l4an agyb al data mn al model al tany
    localField:'_id'//al field 2ly fy al collection dh marbot b aih fy 2ly ana wa2f 3ando dlw2ty
})

export const BrandModel = model('Brand', BrandSchema)
