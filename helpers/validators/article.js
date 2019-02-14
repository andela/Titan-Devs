import Joi from "joi";

const articleSchema = {
  title: Joi.string()
    .trim()
    .required(),
  description: Joi.string()
    .trim()
    .required()
    .min(10)
    .required(),
  body: Joi.string()
    .trim()
    .required(),
  tagsList: Joi.array()
};
export default article => Joi.validate(article, articleSchema);
