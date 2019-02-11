import dotenv from "dotenv";
dotenv.config();

const resetPasswordTamplate = token => {
  const tamplate = `
    <html>
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        </head>

        <body style="background-color: #eee; padding:30px 0">
            <div
            style=" margin: 50px auto; width: 400px; background-color: white;padding: 20px;color: #f4f4f4; border-radius: 5px;box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.10); "
            >
            <div border="0" cellpadding="0" cellspacing="0" width="100%">
                <h2
                style="color:rgb(0,47,255); text-align: center; font-size: 20px; font-family: Helvetica, Arial, sans-serif;"
                >
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                Author's Heaven
=======
                Titan Devs
>>>>>>> #163518685 Add password reset email tamplate
=======
                Titan Devs
>>>>>>> #163518685 Add password reset email tamplate
=======
                Titan Devs
>>>>>>> #163518685 Add password reset email tamplate
                </h2>
                <div
                style="background-color: #fff ;padding: 0px 10px 0px 10px; text-align: center"
                >
                <p
                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #000"
                >
                    Tap the button below to reset your customer account password. If you
                    didn't request a new password, you can safely delete this email.
                </p>
                </div>

                <div
                style="background-color:rgb(0,47,255); border-radius: 3px; text-align: center; border-radius: 30px"
                >
                <a
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
                    href=${process.env.SERVER_HOST}/users/${token}/password
=======
                    href="#"
>>>>>>> #163518685 Add password reset email tamplate
=======
                    href=${process.env.SERVER_HOST}/users/${token}/password
>>>>>>> #163518685 Add mailer for password rest
=======
                    href="#"
>>>>>>> #163518685 Add password reset email tamplate
=======
                    href=${process.env.SERVER_HOST}/users/${token}/password
>>>>>>> #163518685 Add mailer for password rest
=======
                    href="#"
>>>>>>> #163518685 Add password reset email tamplate
=======
                    href=${process.env.SERVER_HOST}/users/${token}/password
>>>>>>> #163518685 Add mailer for password rest
                    target="_blank"
                    style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid rgb(0,47,255); display: inline-block; text-align: center"
                    >
                Reset Password
                </a>
                </div>
            </div>
            </div>
        </body>
    </html>

  `;
  return tamplate;
};

export default resetPasswordTamplate;
