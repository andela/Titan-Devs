import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (email, subject, emailTamplate) => {
  const message = {
    to: email,
<<<<<<< HEAD
    from: { email: process.env.DEVELOPER_EMAIL, name: "Author's Heaven" },
=======
    from: { email: process.env.DEVELOPER_EMAIL, name: "Titan Devs" },
>>>>>>> 500522295e008cd74b6cb73621031258d7f0fe6c
    subject: subject,
    html: emailTamplate
  };

  const response = await sgMail.send(message);
  return response;
};
