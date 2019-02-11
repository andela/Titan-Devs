import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (email, subject, emailTamplate) => {
  const message = {
    to: email,
    from: { email: process.env.DEVELOPER_EMAIL, name: "Titan Devs" },
    subject: subject,
    html: emailTamplate
  };

  const response = await sgMail.send(message);
  return response;
};
