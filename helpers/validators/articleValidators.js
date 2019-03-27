import Joi from "joi";

export const articleSchema = {
  title: Joi.string()
    .trim()
    .min(10)
    .max(200)
    .required(),
  description: Joi.string()
    .trim()
    .min(10)
    .max(255)
    .required(),
  body: Joi.string()
    .trim()
    .min(100)
    .required(),
  tagsList: Joi.array()
};
export default (article, schema = articleSchema) => Joi.validate(article, schema);
