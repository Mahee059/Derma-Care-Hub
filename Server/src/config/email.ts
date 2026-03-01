import nodemailer from "nodemailer";

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
};

export const sendApprovalEmail = async (
  email: string,
  name: string,
  dermatologistId: string,
  status: "APPROVED" | "REJECTED"
) => {
  const subject =
    status === "APPROVED"
      ? "Account Approved - Welcome to SkinCare Platform"
      : "Account Application Update";

  const html =
    status === "APPROVED"
      ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🎉 Account Approved!</h2>
        <p>Dear Dr. ${name},</p>
        <p>Congratulations! Your dermatologist account has been approved.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Account Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Dermatologist ID:</strong> ${dermatologistId}</p>
        </div>
        <p>You can now login to your account using your email and password.</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/login" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Login to Your Account
          </a>
        </div>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>SkinCare Platform Team</p>
      </div>
    `
      : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f44336;">Account Application Update</h2>
        <p>Dear Dr. ${name},</p>
        <p>Thank you for your interest in joining our SkinCare Platform.</p>
        <p>After careful review, we regret to inform you that your dermatologist account application has not been approved at this time.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Dermatologist ID:</strong> ${dermatologistId}</p>
        </div>
        <p>If you believe this is an error or would like to discuss your application, please contact our support team.</p>
        <div style="margin: 30px 0;">
          <a href="mailto:${
            process.env.SUPPORT_EMAIL || process.env.EMAIL_USER
          }" 
             style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Contact Support
          </a>
        </div>
        <p>Best regards,<br>SkinCare Platform Team</p>
      </div>
    `;

  return await sendEmail(email, subject, html);
};

export const sendRegistrationConfirmationEmail = async (
  email: string,
  name: string,
  dermatologistId: string
) => {
  const subject = "Registration Received - Pending Approval";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2196F3;">Registration Received</h2>
      <p>Dear Dr. ${name},</p>
      <p>Thank you for registering with our SkinCare Platform. We have received your application and it is currently under review.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Registration Details:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Dermatologist ID:</strong> ${dermatologistId}</p>
        <p><strong>Status:</strong> Pending Review</p>
      </div>
      <p>Our admin team will review your credentials and notify you via email once your account has been processed.</p>
      <p>This process typically takes 1-3 business days.</p>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>SkinCare Platform Team</p>
    </div>
  `;

  return await sendEmail(email, subject, html);
};
