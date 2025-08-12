import Joi from "joi";

export const authSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
   
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const resetEmailPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
});

export const codeSchema = Joi.object({
    code: Joi.string().required(),
});