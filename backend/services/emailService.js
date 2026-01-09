import nodemailer from "nodemailer";
import { env } from "../config/env.js";

console.log("MAIL_USER =", env.MAIL_USER);
console.log("MAIL_PASS LENGTH =", env.MAIL_PASS?.length);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP VERIFY ERROR:", err);
  } else {
    console.log("✅ SMTP READY");
  }
});

export const sendSupplierMail = async (to, requirement) => {
  const mailOptions = {
    from: `"Requirement Alert" <${env.MAIL_USER}>`,
    to,
    subject: "New Product Requirement",
    html: `
      <h3>New Requirement Received</h3>
      <p><b>Category:</b> ${requirement.category}</p>
      <p><b>Sub Category:</b> ${requirement.subCategory}</p>
      <p><b>Product:</b> ${requirement.product}</p>
      <p><b>Quantity:</b> ${requirement.quantity}</p>
      <p><b>Description:</b> ${requirement.description}</p>
      <p><b>Contact:</b> ${requirement.contact}</p>
      <p><b>Name:</b> ${requirement.name}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${to}`);
};
