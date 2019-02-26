import Joi from "joi";

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
    .max(200),
  bio: Joi.string()
    .min(3)
    .max(200),
  following: Joi.string()
    .min(3)
    .max(200),
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
  const newUser = {};
  const fields = Object.keys(newInfo);
  // eslint-disable-next-line array-callback-return
  fields.map(key => {
    newUser[key] = newInfo[key];
  });
  Joi.validate(newUser, Schema, (error, _values) => {
    if (error) {
      const err = error.details[0].message.replace(/\"/gi, "");
      newUser.error = err;
    }
  });
  return newUser;
};

export default validateInputs;
