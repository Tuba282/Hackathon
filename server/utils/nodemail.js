import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test the connection 
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log(' Email transporter is ready');
  } catch (error) {
    console.error(' Email transporter error:', error);
  }
};


const sendVerifyOTP = async (recipientEmail, otpCode) => {
  const mailOptions = {
    from: `"Query Board" <${process.env.EMAIL_USER}>`, // Fixed syntax
    to: recipientEmail,
    subject: 'Verify Your Email - OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50;">Email Verification</h2>
        <p>Hello! </p>
        <p>Use the following One-Time Password (OTP) to verify your email address:</p>
        <h1 style="color: #333; background: #f0f0f0; padding: 10px; text-align: center; border-radius: 5px;">${otpCode}</h1>
        <p>This OTP is valid for only 10 minutes.</p>
        <br />
        <p>If you didn't request this, you can safely ignore it.</p>
        <p style="color: #999;">TQuery Board Team</p>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    // console.log(' OTP email sent successfully!', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(' Error sending OTP email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Initialize connection verification
verifyConnection();

export default sendVerifyOTP;




export const sendForgetPassword = async (recipientEmail, resetURL) => {
  const mailOptions = {
    from: `"Query Board" <${process.env.EMAIL_USER}>`, 
    to: recipientEmail,
    subject: 'Reset Password',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50;">Reset Password</h2>
        <p>Hello! </p>
        <p>Please click the link below to reset your password</p>
        <p style="color: #333; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetURL}</p>
        <br />
        <p>If you didn't request this, you can safely ignore it.</p>
        <p style="color: #999;">Query Board Team</p>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully!', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(' Error sending reset Password:', error);
    throw new Error(`Failed to send reset Password:: ${error.message}`);
  }
};


// Notify user when admin answers their question
export const sendAnswerNotification = async (recipientEmail, questionTitle,questiondescription, answer) => {
  const mailOptions = {
    from: `"Query Board" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: 'Your Question Has Been Answered!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #4CAF50;">Question Answered</h2>
        <p>Hello!</p>
        <p>Your question has been answered by our admin team:</p>
        <div style="margin-bottom: 10px;">
          <strong>Title:</strong>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; color: #333;">${questionTitle}</div>
        </div>
        <div style="margin-bottom: 10px;">
          <strong>Question:</strong>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; color: #333;">${questiondescription}</div>
        </div>
        <div>
          <strong>Answer:</strong>
          <div style="background: #e8f5e9; padding: 10px; border-radius: 5px; color: #333;">${answer}</div>
        </div>
        <br />
        <p>If you have more questions, feel free to ask!</p>
        <p style="color: #999;">Query Board Team</p>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Answer notification email sent successfully!', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending answer notification:', error);
    throw new Error(`Failed to send answer notification: ${error.message}`);
  }
};