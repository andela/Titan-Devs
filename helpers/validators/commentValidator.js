import Joi from "joi";

const commentSchema = {
  body: Joi.string()
    .trim()
    .required()
};

export default body => Joi.validate(body, commentSchema);
