import dotenv from "dotenv";

dotenv.config();

const emailVerificationTamplate = token => {
  const tamplate = `
    <html>
        <head>
            <title>Email verification</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        </head>
<<<<<<< HEAD
=======

>>>>>>> 05f7424ce44169d70ffc72d42eed94d635bfd2de
        <body style="background-color: #eee; padding:30px 0">
            <div
            style=" margin: 50px auto; width: 400px; background-color: white;padding: 20px;color: #f4f4f4; border-radius: 5px;box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.10); "
            >
            <div border="0" cellpadding="0" cellspacing="0" width="100%">
                <h2
                style="color:rgb(0,47,255); text-align: center; font-size: 20px; font-family: Helvetica, Arial, sans-serif;"
                >
                Authors's Heaven
                </h2>
                <div
                style="background-color: #fff ;padding: 0px 10px 0px 10px; text-align: center"
                >
                <p
                    style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; color: #000"
                >
                    One step away to become the best author in the world.<br>
                    Please verify your email.
                </p>
                </div>
<<<<<<< HEAD
=======

>>>>>>> 05f7424ce44169d70ffc72d42eed94d635bfd2de
                <div
                style="background-color:rgb(0,47,255); border-radius: 3px; text-align: center; border-radius: 30px"
                >
                <a
                    href=${process.env.SERVER_HOST}/users/confirm/${token}
                    target="_blank"
                    style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid rgb(0,47,255); display: inline-block; text-align: center"
                    >
                Confirm my email
                </a>
                </div>
            </div>
            </div>
        </body>
    </html>
<<<<<<< HEAD
=======

>>>>>>> 05f7424ce44169d70ffc72d42eed94d635bfd2de
  `;
  return tamplate;
};

export default emailVerificationTamplate;
