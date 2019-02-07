import joi from "joi";

export const userSchema = joi.object().keys({
  username: joi
    .string()
    .alphanum()
    .required(),
  password: joi
    .string()
    .alphanum()
    .min(8)
    .required(),
  email: joi
    .string()
    .email({ minDomainAtoms: 2 })
    .regex(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required()
});
