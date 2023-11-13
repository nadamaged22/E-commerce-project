import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";



export const signup={
    body:Joi.object().required().keys({
        name:generalFields.name.max(20).required(),
        email:generalFields.email.required(),
        password:generalFields.password.pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)).required(),
        DOB:Joi.date().required(),
        phone:Joi.string().max(11).required(),
        role:Joi.string().max(6).required()
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const signIn={
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
        password:generalFields.password.pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)).required(),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const confirmEmail={
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
        code:Joi.string().max(6).min(6).required()
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const sendCode={
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}
export const ResetPassword={
    body:Joi.object().required().keys({
        email:generalFields.email.required(),
        code:Joi.string().max(6).min(6).required(),
        password:generalFields.password.pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/)).required(),
    }),
    query:Joi.object().required().keys({}),
    params:Joi.object().required().keys({})
}