import nodemailer from "nodemailer";

export default async function sendEmail(to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "adhamsanad96@gmail.com",
      pass: "qglc diyx ueqd rqnh",
    },
  });

  const info = await transporter.sendMail({
    from: '"E-Commerce App" <adhamsanad96@gmail.com>',
    to,
    subject,
    html: htmlContent
  });

  console.log("Message sent:", info.messageId);
}
