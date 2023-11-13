import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const createSubCategory={
    body:Joi.object().required().keys({
        name:generalFields.name.max(30).min(2).required()
    }),
    file:generalFields.file.required(),
    params:Joi.object().required().keys({
        categoryID:generalFields.id.required()
    })
}
export const updateSubCategory={
    body:Joi.object().required().keys({
        name:generalFields.name
    }),
    file:generalFields.file.optional(),
    params:Joi.object().required().keys({
        subcategoryID:generalFields.id.optional()
    }),
    query:Joi.object().required().keys({
        categoryID:generalFields.id.optional()
    })
}
