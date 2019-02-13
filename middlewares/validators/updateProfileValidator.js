import Joi from "joi";
import { join } from "path";

const Schema = Joi.object().keys({
  username: Joi.string()
    .min(3)
    .max(30),
  firstname: Joi.string()
    .min(3)
    .max(30),
  lastname: Joi.string()
    .min(3)
    .max(30),
  image: Joi.string()
    .min(3)
    .max(30),
  bio: Joi.string()
    .min(3)
    .max(30),
  following: Joi.string()
    .min(3)
    .max(30),
  gender: Joi.string()
    .min(3)
    .max(30),
  phone: Joi.string()
    .min(3)
    .max(30),
  address: Joi.string()
    .min(3)
    .max(30),
  email: Joi.string()
    .min(3)
    .max(30)
});
const validateInputs = newInfo => {
  let newUser = {};
  let fields = Object.keys(newInfo);
  fields.map(key => {
    newUser[key] = newInfo[key];
  });
  Joi.validate(newUser, Schema, (error, values) => {
    if (error) {
      let err = error.details[0].message.replace(/\"/gi, "");
      newUser.error = err;
    }
  });
  return newUser;
};

export default validateInputs;
