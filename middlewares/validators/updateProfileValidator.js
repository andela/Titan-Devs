import Joi from "joi";

const Schema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  firstname: Joi.string()
    .alphanum()
    .min(3)
    .max(30),
  lastname: Joi.string()
    .alphanum()
    .min(3)
    .max(30),

  image: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  bio: Joi.string()
    .alphanum()
    .min(3)
    .max(30),
  following: Joi.string()
    .alphanum()
    .min(3)
    .max(30),
  gender: Joi.string()
    .alphanum()
    .min(3)
    .max(30),
  phone: Joi.string()
    .alphanum()
    .min(3)
    .max(30),
  address: Joi.string()
    .alphanum()
    .min(3)
    .max(30),
  email: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
});
const validateInputs = newInfo => {
  let newUser = {};
  if (newInfo.username) {
    newUser.username = newInfo.username;
  }
  if (newInfo.firstname) {
    newUser.firstname = newInfo.username;
  }
  if (newInfo.lastname) {
    newUser.lastname = newInfo.lastname;
  }
  if (newInfo.image) {
    newUser.image = newInfo.image;
  }
  if (newInfo.bio) {
    newUser.bio = newInfo.bio;
  }
  if (newInfo.following) {
    newUser.following = newInfo.following;
  }
  if (newInfo.gender) {
    newUser.gender = newInfo.gender;
  }
  if (newInfo.phone) {
    newUser.phone = newInfo.phone;
  }
  if (newInfo.address) {
    newUser.address = newInfo.address;
  }
  if (newInfo.email) {
    newUser.email = newInfo.email;
  }

  return newUser;
};

export default validateInputs;
