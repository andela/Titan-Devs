import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (email, subject, emailTemplate) => {
  const message = {
    to: email,
    from: { email: process.env.DEVELOPER_EMAIL, name: "Author's Heaven" },
    subject: subject,
    html: emailTemplate
  };

  const response = await sgMail.send(message);
  return response;
};
