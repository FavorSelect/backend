const { transporter } = require("./emailConfigMiddleware");

const sendForgetPasswordURL = async (email, URL) => {
  try {
    const response = await transporter.sendMail({
      from: '"FavorSelect Support" <support@favorselect.com>',
      to: email,
      subject: "FavorSelect Password Reset Request",
      text: `We received a request to reset your FavorSelect password. Click the link below to reset your password:\n\n${URL}\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #fff0f5; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2);">
          <div style="text-align: center; padding: 15px 0;">
            <img src="https://logo.png" alt="FavorSelect Logo" style="max-width: 150px;">
          </div>
          <div style="background-color: #ffffff; padding: 25px; border-radius: 10px;">
            <h2 style="color: #d63384; text-align: center;">Reset Your Password</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              We've received a request to reset the password for your FavorSelect account.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${URL}" style="background-color: #d63384; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-size: 16px;">
                Reset Password
              </a>
            </div>
            <p style="color: #888; font-size: 14px; text-align: center;">
              <strong>Note:</strong> This link will expire in 15 minutes. Please do not share it with anyone.
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              If you did not request a password reset, you can safely ignore this email or contact our support team.
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #aaa; font-size: 12px;">
            © 2025 FavorSelect. All rights reserved.
          </div>
        </div>
      `,
    });

    console.log("Password reset link email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

// Send Welcome Email
const sendRecoveryEmail = async (email, name) => {
  try {
    const loginURL = `${process.env.FRONTEND_URL}/signin`;
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <support@favorselect.com>',
      to: email,
      subject: "Your FavorSelect Password Has Been Reset!",
      text: `Hi ${name}, your password has been successfully reset. You can now sign in using your new password. Login here: ${loginURL}`,
      html: `
        <div style="max-width: 600px; background-color: #ffe6f0; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(255, 105, 180, 0.2); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect Logo" style="max-width: 140px;" />
          </div>
          <h2 style="color: #d63384; font-size: 26px; text-align: center; margin-bottom: 16px;">
            Hi ${name}, your password has been reset!
          </h2>
          <p style="color: #555; font-size: 17px; text-align: center; line-height: 1.6;">
            You can now log in to your FavorSelect account with your new password. Click the button below to go to the login page:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginURL}" style="background-color: #ff69b4; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 16px; border-radius: 6px;">
              Go to Login
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you did not request a password reset, please contact our support team immediately.
          </p>
          <p style="text-align: center; color: #d63384; font-weight: bold; margin-top: 30px;">
             FavorSelect Team
          </p>
        </div>
      `,
    });

    console.log("Recovery email sent successfully:", response);
  } catch (error) {
    console.error("Error sending recovery email:", error);
  }
};



const sendVerificationEmail = async (email, fullName, otp) => {
  try {
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <support@favorselect.com>',
      to: email,
      subject: "🔐 Verify Your Email - FavorSelect",
      text: `Hi ${fullName},\n\nThank you for registering at FavorSelect!\n\nPlease verify your email by entering the following OTP:\n\n OTP: ${otp}\n\nIf you did not request this, please ignore this message.\n\nCheers,\nFavorSelect Team`,
      html: `
        <div style="max-width: 600px; background-color: #fff0f5; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(255, 105, 180, 0.2); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect Logo" style="max-width: 140px;" />
          </div>
          <h2 style="color: #d63384; font-size: 26px; text-align: center; margin-bottom: 16px;">
            🔐 Email Verification
          </h2>
          <p style="color: #555; font-size: 17px; text-align: center; line-height: 1.6;">
            Hi <strong>${fullName}</strong>, thank you for signing up with <strong>FavorSelect</strong>! Please verify your email by entering the OTP below:
          </p>
          <div style="background-color: #ffe6f0; padding: 14px 0; text-align: center; border-radius: 6px; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #e83e8c;"> ${otp}</span>
          </div>
          <p style="color: #555; font-size: 17px; text-align: center; line-height: 1.6;">
            Enter this OTP on the verification page to complete your registration.
          </p>
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you didn’t request this email, you can safely ignore it.
          </p>
          <p style="text-align: center; color: #d63384; font-weight: bold; margin-top: 30px;">
             FavorSelect Team
          </p>
        </div>
      `,
    });

    console.log("Verification email with OTP sent successfully:", response);
  } catch (error) {
    console.error("Error sending verification email with OTP:", error);
  }
};
const sendWelcomeEmail = async (email, fullName) => {
  try {
    const loginURL = `${process.env.FRONTEND_URL}/login`; 
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <support@favorselect.com>',
      to: email,
      subject: "✅ Email Verified",
      text: `Hi ${fullName},\n\nYour email has been successfully verified! ✅\n\n\n\nLogin: ${loginURL}\n\nThanks for joining FavorSelect!\n\n- The FavorSelect Team`,
      html: `
        <div style="max-width: 600px; background-color: #fff0f5; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(255, 105, 180, 0.2); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect Logo" style="max-width: 140px;" />
          </div>
          <h2 style="color: #d63384; font-size: 26px; text-align: center; margin-bottom: 16px;">
            ✅ Welcome, ${fullName}!
          </h2>
          <p style="color: #555; font-size: 17px; text-align: center; line-height: 1.6;">
            Your email has been successfully verified. 
          </p>
    
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginURL}" style="background-color: #d63384; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 18px; border-radius: 8px;">
              Go to Login
            </a>
          </div>
          <p style="text-align: center; font-size: 15px; color: #888;">
           feel free to log in above.
          </p>
          <p style="text-align: center; margin-top: 30px; font-weight: bold; color: #d63384;">
             FavorSelect Team
          </p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", response);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

const  sendChangePasswordEmail = async (email, fullName) => {
  try {
    const loginURL = `${process.env.FRONTEND_URL}/login`; 
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <support@favorselect.com>',
      to: email,
      subject: "🔐 Password Changed Successfully",
      text: `Hi ${fullName},\n\nYour password has been successfully changed! 🔐\n\n\n\nIf you did not request this change, please contact support immediately.\n\nLogin: ${loginURL}\n\nThanks for using FavorSelect!\n\n- The FavorSelect Team`,
      html: `
        <div style="max-width: 600px; background-color: #f0f8ff; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(0, 123, 255, 0.2); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect Logo" style="max-width: 140px;" />
          </div>
          <h2 style="color: #007bff; font-size: 26px; text-align: center; margin-bottom: 16px;">
            🔐 Password Changed Successfully, ${fullName}!
          </h2>
          <p style="color: #555; font-size: 17px; text-align: center; line-height: 1.6;">
            Your password has been successfully changed. If you did not request this change, please contact our support team.
          </p>
    
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginURL}" style="background-color: #007bff; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 18px; border-radius: 8px;">
              Go to Login
            </a>
          </div>
          <p style="text-align: center; font-size: 15px; color: #888;">
           Feel free to log in with your new password above.
          </p>
          <p style="text-align: center; margin-top: 30px; font-weight: bold; color: #007bff;">
             FavorSelect Team
          </p>
        </div>
      `,
    });

    console.log("Password change email sent successfully:", response);
  } catch (error) {
    console.error("Error sending password change email:", error);
  }
};

const  sendUpdateProfileEmail= async (email, fullName) => {
  try {
    const loginURL = `${process.env.FRONTEND_URL}/profile`; 
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <support@favorselect.com>',
      to: email,
      subject: "🔄 Profile Updated Successfully",
      text: `Hi ${fullName},\n\nYour profile has been successfully updated! 🔄\n\n\n\nIf you did not make these changes, please contact support immediately.\n\nProfile: ${loginURL}\n\nThanks for being with FavorSelect!\n\n- The FavorSelect Team`,
      html: `
        <div style="max-width: 600px; background-color: #e8f0fe; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(23, 162, 184, 0.2); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect Logo" style="max-width: 140px;" />
          </div>
          <h2 style="color: #17a2b8; font-size: 26px; text-align: center; margin-bottom: 16px;">
            🔄 Profile Updated Successfully, ${fullName}!
          </h2>
          <p style="color: #555; font-size: 17px; text-align: center; line-height: 1.6;">
            Your profile details have been successfully updated. If you did not make these changes, please contact our support team.
          </p>
    
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginURL}" style="background-color: #17a2b8; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 18px; border-radius: 8px;">
              View Profile
            </a>
          </div>
          <p style="text-align: center; font-size: 15px; color: #888;">
           Feel free to check and update your details anytime.
          </p>
          <p style="text-align: center; margin-top: 30px; font-weight: bold; color: #17a2b8;">
             FavorSelect Team
          </p>
        </div>
      `,
    });

    console.log("Profile update email sent successfully:", response);
  } catch (error) {
    console.error("Error sending profile update email:", error);
  }
};


module.exports = {
  sendForgetPasswordURL,
  sendRecoveryEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendChangePasswordEmail,
  sendUpdateProfileEmail
};
