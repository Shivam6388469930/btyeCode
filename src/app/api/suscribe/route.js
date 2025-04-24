import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { email } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "agraharishivam6388@gmail.com",
      pass: "dpll htzh zjhi vjjs", // App password
    },
  });

  const mailOptions = {
    from: "agraharishivam6388@gmail.com",
    to: email,
    subject: "📩 Thank you for subscribing to BBLC",
    text: `
Hello,

Thank you for subscribing to BBLC.

We'll keep you updated with our latest blogs and articles.

Regards,
BBLC Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <h2 style="color: #4a90e2;">📩 Thank you for subscribing!</h2>
        <p>We're excited to have you on board, <strong>${email}</strong>.</p>
        <p>You'll now receive notifications about our latest blogs and articles.</p>
        <p style="margin-top: 30px;">Regards,<br><strong>ByteCode Team</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
