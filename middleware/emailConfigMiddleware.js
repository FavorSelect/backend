const nodemailer=require('nodemailer')
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass:process.env.EMAIL_PASSWORD,
  },
});
module.exports = {transporter};