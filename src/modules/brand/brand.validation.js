import joi from "joi"
import { generalFields } from "../../middleware/validation.js"


export const createbrand={
    body:joi.object().required().keys({
        name:generalFields.name.max(20).min(2).required(),
    }),
    file:generalFields.file.required(),
    query:joi.object().required().keys({
        subcategoryID:generalFields.id.required(),
        categoryID:generalFields.id.required()
    })
}
export const updateBrand={
    body:joi.object().required().keys({
        name:generalFields.name.max(20).min(2).optional(),
    }),
    file:generalFields.file.optional(),
    params:joi.object().required().keys({
        brandId:generalFields.id.required()
    }),
    query:joi.object().required().keys({
        subcategoryID:generalFields.id.optional(),
        categoryID:generalFields.id.optional()
    })

}
