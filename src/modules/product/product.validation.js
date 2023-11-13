import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createproduct={
    body:joi.object().required().keys({
        name:generalFields.name.max(30).min(2).required(),
        description:generalFields.name.max(100).min(10),
        quantity:joi.number().min(1).positive(),
        price:joi.number().min(0).positive(),
        appliedDiscount:joi.number().min(0).max(100),
        colors:joi.custom((value,helper)=>{
            if(value){ //3l4an al data 2ly btgyly btkon array fa ana h3mlha parsing l object wh3ml 3alyha custom validation 
                value=JSON.parse(value)
                const ArrayValidationSchema=joi.object({
                    value:joi.array().items(joi.string().alphanum())
                })
                const ValRes=ArrayValidationSchema.validate({value})
                if(ValRes.error){
                    return helper.message="INVALID VALUE OF COLORS "
                }else{
                    return true
                }
            }
        }),
        sizes:joi.custom((value,helper)=>{
            if(value){ //3l4an al data 2ly btgyly btkon array fa ana h3mlha parsing l object wh3ml 3alyha custom validation 
                value=JSON.parse(value)
                const ArrayValidationSchema=joi.object({
                    value:joi.array().items(joi.string().alphanum())
                })
                const ValRes=ArrayValidationSchema.validate({value})
                if(ValRes.error){
                    return helper.message="INVALID VALUE OF SIZES "
                }else{
                    return true
                }
            }
        }),
        categoryID:generalFields.id.required(),
        subcategoryID:generalFields.id.required(),
        brandID:generalFields.id.required()
    }),
    files:joi.object().keys({
        image:joi.array().items(generalFields.file).length(1).required(),
        coverImages:joi.array().items(generalFields.file).length(5)
    })
}
export const updateproduct={
    body:joi.object().required().keys({
        name:generalFields.name.max(30).min(2).optional(),
        description:generalFields.name.max(100).min(10).optional(),
        quantity:joi.number().min(1).positive().optional(),
        price:joi.number().min(0).positive().optional(),
        appliedDiscount:joi.number().min(0).max(100).optional(),
        colors:joi.custom((value,helper)=>{
            if(value){ //3l4an al data 2ly btgyly btkon array fa ana h3mlha parsing l object wh3ml 3alyha custom validation 
                value=JSON.parse(value)
                const ArrayValidationSchema=joi.object({
                    value:joi.array().items(joi.string().alphanum())
                })
                const ValRes=ArrayValidationSchema.validate({value})
                if(ValRes.error){
                    return helper.message="INVALID VALUE OF COLORS "
                }else{
                    return true
                }
            }
        }).optional(),
        sizes:joi.custom((value,helper)=>{
            if(value){ //3l4an al data 2ly btgyly btkon array fa ana h3mlha parsing l object wh3ml 3alyha custom validation 
                value=JSON.parse(value)
                const ArrayValidationSchema=joi.object({
                    value:joi.array().items(joi.string().alphanum())
                })
                const ValRes=ArrayValidationSchema.validate({value})
                if(ValRes.error){
                    return helper.message="INVALID VALUE OF SIZES "
                }else{
                    return true
                }
            }
        }).optional(),
        categoryID:generalFields.id.optional(),
        subcategoryID:generalFields.id.optional(),
        brandID:generalFields.id.optional()
    }),
    files:joi.object().keys({
        image:joi.array().items(generalFields.file).length(1).optional(),
        coverImages:joi.array().items(generalFields.file).length(5)
    })
}