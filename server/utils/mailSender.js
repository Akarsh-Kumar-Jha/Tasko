const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendMail = async (email, subject, body) => {
  try {
    console.log("Send Mail To:- ",email);
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SERVER,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_API_KEY,
      },
    });

    const info = await transporter.sendMail({
      from: `"Tasko" <thecodegyaan@gmail.com>`,
      to: email,
      subject,
      html: body,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending mail:", error.message);
  }
};
