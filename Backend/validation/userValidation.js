import Joi from "joi";

export const userSchema = Joi.object({
    gmail : Joi.string().email().required(),
    password : Joi.string().min(7).required(),
});

export const userSendOtpSchema = Joi.object({
    gmail : Joi.string().email().required()
})

export const userVerifyOtpSchema = Joi.object({
    gmail : Joi.string().email().required(),
    otp : Joi.number().required()
})

export const interestCatSchema = Joi.object({
    id : Joi.string().required(),
    interestlist : Joi.required()
});

export const saveNewsSchema = Joi.object({
    id : Joi.string().required(),
    newsdata : Joi.required()
});

export const removeSaveNewSchema = Joi.object({
    id : Joi.string().required(),
    key : Joi.string().required()
})

export const exportSaveNewsSchema = Joi.object({
    id : Joi.string().required()
})