import dotenv from "dotenv";
import emailTamplate from "../helpers/resetPasswordTamplate";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (email, token) => {
  const message = {
    to: email,
    from: { email: process.env.DEVELOPER_EMAIL, name: "Author's Heaven" },
    subject: `Author's Heaven Password Reset`,
    html: emailTamplate(token)
  };

  const response = await sgMail.send(message);
  return response;
};
