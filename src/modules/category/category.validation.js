import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createCategory={
    body:joi.object().required().keys({
        name:generalFields.name.max(30).min(2).required()
    }),
    file:generalFields.file.required()
}

export const updatecategory={
    body:joi.object().required().keys({
        name:generalFields.name.max(30).min(2).optional()
    }),
    file:generalFields.file.optional(),
    params:joi.object().required().keys({
        categoryID:generalFields.id.required()
    })
}
