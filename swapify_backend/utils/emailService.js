const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();
// Configure Nodemailer with Zoho Mail
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send a password reset email
const sendPasswordResetEmail = async (email, resetToken, frontendUrl) => {

  const resetLink = `${frontendUrl}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  try {
    const info = await transporter.sendMail({
      from: '"Swapify Team" <no-reply@swapify.club>',
      to: email,
      subject: 'Reset Your Swapify Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://swapify.club/assets/Swapify.jpg" alt="Swapify Logo" style="width: 100px; height: auto; border-radius: 5px;">
          </div>
          <h2 style="color: #4338ca; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your Swapify account. To reset your password, click the button below:</p>
          <p style="text-align: center;">
            <a href="${resetLink}" style="display: inline-block; background-color: #4338ca; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </p>
          <p>If you didn't request a password reset, you can safely ignore this email. The link will expire in 1 hour.</p>
          <p>Thank you,<br>The Swapify Team</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `
    });
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return { success: false, error };
  }
};


module.exports = {
  transporter,
  sendPasswordResetEmail
};