const { transporter } = require("../../config/nodemailerConfig/emailConfigMiddleware");

const logo = process.env.LOGO;
const sendVerificationEmail = async (email, fullName, otp) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: " Email Verification Code - FavorSelect",
        text: `Hi ${fullName},\n\nYour FavorSelect verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, you can safely ignore this email.\n\n- FavorSelect Team`,
        html: `
          <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logo}" alt="FavorSelect Logo" style="max-height: 60px;" />
            </div>
            <h2 style="text-align: center; padding: 20px; background-color:#d63384;  border-radius: 6px; color: #f6f1f3;">Verification Code</h2>
            <div style="text-align: center; padding: 16px;  margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold;">${otp}</span>
            </div>
            <p style="text-align: center; color: #555; font-size: 15px;">(This code will expire 10 minutes after it was sent.)</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
              FavorSelect will never ask for your password, credit card, or sensitive information via email. If you did not request this email, you can safely ignore it.
            </p>
            <p style="text-align: center; font-size: 13px; color: #aaa; margin-top: 30px;">
              © ${new Date().getFullYear()} FavorSelect. All rights reserved.
            </p>
          </div>
        </div>
        `
      });
  
      console.log("Verification email sent successfully:", response);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };
  
  const sendWelcomeEmail = async (email, fullName) => {
    try {
      const loginURL = `${process.env.FRONTEND_URL}/login`; 
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: " Email Verified",
        text: `Hi ${fullName},\n\nYour email has been successfully verified! \n\n\n\nLogin: ${loginURL}\n\nThanks for joining FavorSelect!\n\n- The FavorSelect Team`,
        html: `
          <div style="max-width: 600px; background-color: #fff0f5; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(255, 105, 180, 0.2); font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${logo}" alt="FavorSelect Logo" style="max-width: 140px;" />
            </div>
            <h2 style="color: #d63384; font-size: 26px; text-align: center; margin-bottom: 16px;">
               Welcome, ${fullName}!
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


  const sendTwoFactorOtp = async (email, fullName, otp) => {
  try {
    const verifyLoginURL = `${process.env.FRONTEND_URL}/verify-2fa`; 
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <favorselect113@gmail.com>',
      to: email,
      subject: "Your 2FA Login OTP - FavorSelect",
      text: `Hi ${fullName},\n\nYour OTP for login is: ${otp}\nIt is valid for 10 minutes.\n\nIf you didn't attempt to login, please ignore this message.\n\n- The FavorSelect Team`,
      html: `
        <div style="max-width: 600px; background-color: #fff0f5; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(255, 105, 180, 0.2); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logo}" alt="FavorSelect Logo" style="max-width: 140px;" />
          </div>
          <h2 style="color: #d63384; font-size: 26px; text-align: center; margin-bottom: 16px;">
             Hi ${fullName} 
          </h2>
          <p style="color: #555; font-size: 17px; text-align: center; line-height: 1.6;">
            Your one-time password (OTP) for logging in is:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 28px; font-weight: bold; background: #d63384; color: #fff; padding: 12px 24px; border-radius: 8px;">
              ${otp}
            </span>
          </div>
          <p style="text-align: center; font-size: 15px; color: #888;">
            This OTP is valid for 10 minutes. Do not share this with anyone.
          </p>
          <p style="text-align: center; font-size: 15px; color: #888;">
            If you did not request this, please ignore the email.
          </p>
          <p style="text-align: center; margin-top: 30px; font-weight: bold; color: #d63384;">
             - The FavorSelect Team
          </p>
        </div>
      `,
    });

    console.log("2FA OTP email sent successfully:", response);
  } catch (error) {
    console.error("Error sending 2FA OTP email:", error);
  }
};

const sendTwoFactorAuthStatusEmail = async (email, fullName, isEnabled) => {
  try {
    const statusText = isEnabled ? "enabled" : "disabled";
    const actionColor = isEnabled ? "#198754" : "#dc3545";
    const actionBgColor = isEnabled ? "#d1e7dd" : "#f8d7da";
    const actionMessage = isEnabled
      ? "You have successfully enabled Two-Factor Authentication (2FA) for your account."
      : "You have disabled Two-Factor Authentication (2FA) for your account. If this wasn't you, please secure your account immediately.";

    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <favorselect113@gmail.com>',
      to: email,
      subject: `Two-Factor Authentication ${statusText} - FavorSelect`,
      text: `Hi ${fullName},\n\n${actionMessage}\n\n- The FavorSelect Team`,
      html: `
        <div style="max-width: 600px; background-color: ${actionBgColor}; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logo}" alt="FavorSelect Logo" style="max-width: 140px;" />
          </div>
          <h2 style="color: ${actionColor}; font-size: 26px; text-align: center; margin-bottom: 16px;">
            Hi ${fullName},
          </h2>
          <p style="color: #333; font-size: 17px; text-align: center; line-height: 1.6;">
            ${actionMessage}
          </p>
          <p style="text-align: center; margin-top: 30px; font-weight: bold; color: #d63384;">
            - The FavorSelect Team
          </p>
        </div>
      `,
    });

    console.log(`2FA status email (${statusText}) sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending 2FA status email:", error);
  }
};


  const sendForgetPasswordURL = async (email, URL) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Support" <favorselect113@gmail.com>',
        to: email,
        subject: "FavorSelect Password Reset Request",
        text: `We received a request to reset your FavorSelect password. Click the link below to reset your password:\n\n${URL}\n\nIf you did not request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #fff0f5; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(255, 105, 180, 0.2);">
            <div style="text-align: center; padding: 15px 0;">
              <img src="${logo}" alt="FavorSelect Logo" style="max-width: 150px;">
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
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: "Your FavorSelect Password Has Been Reset!",
        text: `Hi ${name}, your password has been successfully reset. You can now sign in using your new password. Login here: ${loginURL}`,
        html: `
          <div style="max-width: 600px; background-color: #ffe6f0; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(255, 105, 180, 0.2); font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${logo}" alt="FavorSelect Logo" style="max-width: 140px;" />
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
  
  
  const  sendChangePasswordEmail = async (email, fullName) => {
    try {
      const loginURL = `${process.env.FRONTEND_URL}/login`; 
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: " Password Changed Successfully",
        text: `Hi ${fullName},\n\nYour password has been successfully changed! \n\n\n\nIf you did not request this change, please contact support immediately.\n\nLogin: ${loginURL}\n\nThanks for using FavorSelect!\n\n- The FavorSelect Team`,
        html: `
          <div style="max-width: 600px; background-color: #f0f8ff; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(0, 123, 255, 0.2); font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${logo}" alt="FavorSelect Logo" style="max-width: 140px;" />
            </div>
            <h2 style="color: #007bff; font-size: 26px; text-align: center; margin-bottom: 16px;">
               Password Changed Successfully, ${fullName}!
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
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: " Profile Updated Successfully",
        text: `Hi ${fullName},\n\nYour profile has been successfully updated! \n\n\n\nIf you did not make these changes, please contact support immediately.\n\nProfile: ${loginURL}\n\nThanks for being with FavorSelect!\n\n- The FavorSelect Team`,
        html: `
          <div style="max-width: 600px; background-color: #e8f0fe; margin: 0 auto; padding: 24px; border-radius: 12px; box-shadow: 0 6px 12px rgba(23, 162, 184, 0.2); font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${logo}" alt="FavorSelect Logo" style="max-width: 140px;" />
            </div>
            <h2 style="color: #17a2b8; font-size: 26px; text-align: center; margin-bottom: 16px;">
              Profile Updated Successfully, ${fullName}!
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
    sendUpdateProfileEmail,
    sendChangePasswordEmail,
    sendRecoveryEmail,
    sendForgetPasswordURL ,
    sendWelcomeEmail,
    sendVerificationEmail,
    sendTwoFactorOtp,
     sendTwoFactorAuthStatusEmail

  }
    
