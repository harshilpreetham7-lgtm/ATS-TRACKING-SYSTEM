const nodemailer = require('nodemailer');

let transporter;

try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} catch (error) {
  console.warn('Email transporter not initialized:', error.message);
  transporter = null;
}

const sendWelcomeEmail = async (email, name) => {
  if (!transporter) {
    console.warn('Email service not available');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to ATS - Your Account Created Successfully!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to ATS, ${name}!</h2>
          <p>Your account has been created successfully. You can now:</p>
          <ul>
            <li>Browse job opportunities</li>
            <li>Apply for positions</li>
            <li>Track your applications</li>
            <li>Manage your profile</li>
          </ul>
          <p>Best regards,<br>The ATS Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

const sendApplicationUpdateEmail = async (email, name, jobTitle, status) => {
  if (!transporter) {
    console.warn('Email service not available');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Application Update: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Application Update</h2>
          <p>Dear ${name},</p>
          <p>Your application for <strong>${jobTitle}</strong> has been updated to: <strong>${status}</strong></p>
          <p>Please log in to your account for more details.</p>
          <p>Best regards,<br>The ATS Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Application update email sent to:', email);
  } catch (error) {
    console.error('Error sending application update email:', error);
    throw error;
  }
};

module.exports = { sendWelcomeEmail, sendApplicationUpdateEmail };