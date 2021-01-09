const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //  transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // email options
  const mailOptions = {
    from: "Event Sys <event@logicwind.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // send  email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
