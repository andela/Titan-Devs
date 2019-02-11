import dotenv from "dotenv";
<<<<<<< HEAD
=======
import emailTamplate from "../helpers/resetPasswordTamplate";
>>>>>>> #163518685 Add password reset email tamplate
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

<<<<<<< HEAD
// eslint-disable-next-line import/prefer-default-export
=======
<<<<<<< HEAD
>>>>>>> #163518685 Add password reset email tamplate
export const sendEmail = async (email, subject, emailTamplate) => {
  const message = {
    to: email,
    from: { email: process.env.DEVELOPER_EMAIL, name: "Titan Devs" },
    subject,
    html: emailTamplate
=======
export const sendEmail = async (email, token) => {
  const message = {
    to: email,
    from: { email: process.env.DEVELOPER_EMAIL, name: "Titan Devs" },
    subject: `Author's Heaven Password Reset`,
    html: emailTamplate(token)
>>>>>>> #163518685 Add password reset email tamplate
  };

  const response = await sgMail.send(message);
  return response;
};
