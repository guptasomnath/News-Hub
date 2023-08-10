import Joi from "joi";

export const interestScoreSchema = Joi.object({
    id : Joi.string().required(),
    key : Joi.string().required(),
    value : Joi.number().integer().positive().required()
})