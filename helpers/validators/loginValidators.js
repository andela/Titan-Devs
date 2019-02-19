/** Define the function for validating the login credentials */

const validate = (email, password) => {
  if (!email) {
    return { message: "Please provide an email" };
  }
  if (!password) {
    return { message: "Please provide a password" };
  }
  if (email.trim().length === 0) {
    return { message: "Email cannot be empty" };
  }
  if (password.trim().length === 0) {
    return { message: "Password cannot be empty" };
  }
  if (!/.+@.+\..+/.test(email)) {
    return { message: "Invalid email format!" };
  }
};

export default validate;
