import joi from "joi";

const ratingOne = joi.object().keys({
  userId: joi
    .string()
    .guid()
    .required()
    .label("Please Provide a valid user id"),
  ratingId: joi
    .string()
    .guid()
    .label("Please Provide a valid user id"),
  slug: joi
    .string()
    .required()
    .label("Please provide a valid slug"),
  rating: joi
    .number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .label("Please provide a valid rating")
});
const ratingAll = joi.object().keys({
  userId: joi
    .string()
    .guid()
    .required()
    .label("Please Provide a valid user id"),
  slug: joi
    .string()
    .required()
    .label("Please provide a valid slug")
});
export { ratingOne, ratingAll };
