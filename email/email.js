import nodemailer from "nodemailer";
import { template } from "./emailTemlate.js";
import  jwt  from "jsonwebtoken";

export default async function sendEmail(email){ 
  const transporter = nodemailer.createTransport({
   service: "Gmail",
    auth: {
     user: "adhamsanad96@gmail.com",
     pass: "qglc diyx ueqd rqnh",
  },
});
const emailToken = jwt.sign(email ,"myEmail")


  const info = await transporter.sendMail({
    from: '"ُE-Commerce App" <adhamsanad96@gmail.com>',
    to: email,
    subject: "Verify your email address",
    text: "Please verify your email to complete your account setup.",
    html: template(emailToken), 
  });

  console.log("Message sent:", info.messageId);

}