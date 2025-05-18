const { transporter } = require("../../config/nodemailerConfig/emailConfigMiddleware");
const logo = process.env.LOGO;
const sendVerificationEmail = async (email, fullName, otp) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: "Email Verification Code - FavorSelect",
        text: `Hi ${fullName},\n\nYour FavorSelect verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, you can safely ignore this email.\n\n- FavorSelect Team`,
        html: `
          <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${logo}" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
              </div>
              <h2 style="text-align: center; padding: 20px; background-color:#d63384; border-radius: 6px; color: #f6f1f3;">Verification Code</h2>
              <div style="text-align: center; padding: 16px; margin: 20px 0;">
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
  
  const sendWelcomeEmailToSeller = async (email, fullName) => {
    try {
      const loginURL = `${process.env.FRONTEND_URL}/login`;
  
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: " Email Verified - Approval Request Submitted",
        text: `Hi ${fullName},\n\nYour email has been successfully verified! \n\nYour request to become a seller has been sent for approval. Once your account is approved, you will be able to log in and access your seller dashboard.\n\nIf you are already approved, you can log in now:\n\nLogin: ${loginURL}\n\nThanks for choosing FavorSelect!\n\n- The FavorSelect Team`,
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
              <br />
              Your request to become a seller has been submitted to the admin for approval.
              You will be notified once your account is approved.
            </p>
  
            <p style="color: #777; font-size: 15px; text-align: center; margin-top: 10px;">
              If your account is already approved, feel free to log in now using the button below.
            </p>
  
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginURL}" style="background-color: #d63384; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 18px; border-radius: 8px;">
                Go to Login
              </a>
            </div>
  
            <p style="text-align: center; font-size: 15px; color: #888;">
              Thank you for choosing FavorSelect to grow your business.
            </p>
  
            <p style="text-align: center; margin-top: 30px; font-weight: bold; color: #d63384;">
              - The FavorSelect Team
            </p>
          </div>
        `,
      });
  
      console.log("Seller welcome email sent successfully:", response);
    } catch (error) {
      console.error("Error sending seller welcome email:", error);
    }
  };
  
  const sendSellerApprovalEmail = async (sellerEmail, sellerName) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: process.env.ADMIN_EMAIL,
        subject: "New Seller Approval Request - FavorSelect",
        text: `${sellerName} has requested to become a seller on FavorSelect. Please review their application and approve it from your admin panel.`,
        html: `
          <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px; 
                      border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
            <h2 style="color: #1e88e5; font-size: 24px; text-align: center; margin-bottom: 15px;">
              New Seller Request
            </h2>
            <p style="color: #555555; font-size: 18px; text-align: center; line-height: 1.6; margin-bottom: 15px;">
              <strong>${sellerName}</strong> has applied to become a seller on <strong>FavorSelect</strong>. Please review their request and approve if appropriate.
            </p>
            <p style="color: #555555; font-size: 18px; text-align: center; line-height: 1.6; margin-bottom: 15px;">
              <strong>Email:</strong> ${sellerEmail}
            </p>
            <p style="color: #555555; font-size: 16px; text-align: center; margin-bottom: 15px;">
              You can approve from your admin dashboard or using the button below.
            </p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="YOUR_SELLER_APPROVAL_LINK_HERE" target="_blank" 
                 style="background-color: #1e88e5; color: #ffffff; padding: 12px 20px; text-decoration: none;
                        font-size: 18px; border-radius: 5px; display: inline-block;">
                Approve Seller
              </a>
            </div>
            <p style="color: #555555; font-size: 16px; text-align: center; margin-top: 20px;">
              Best Regards,<br>
              <strong style="color: #1e88e5;">FavorSelect Team</strong>
            </p>
          </div>
        `,
      });
  
      console.log("Seller approval email sent successfully", response);
    } catch (error) {
      console.error("Error sending seller approval email:", error);
    }
  };
  

  const sendApprovedEmail = async (email, sellerName) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: " Seller Account Approved - FavorSelect",
        text: `Hi ${sellerName},\n\nYour seller account has been approved successfully on FavorSelect.\n\nYou can now wait for your agreement approval, or if it has already been approved, you may log in to your seller dashboard.\n\nThank you for joining us!\n\n- FavorSelect Team`,
        html: `
          <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${logo}" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
              </div>
              <h2 style="text-align: center; padding: 20px; background-color: #198754; border-radius: 6px; color: #ffffff;">Account Approved</h2>
              <p style="text-align: center; font-size: 16px; color: #333; margin-top: 20px;">
                Hi <strong>${sellerName}</strong>,
              </p>
              <p style="text-align: center; font-size: 15px; color: #555; margin: 20px 0;">
                Your seller account has been approved successfully.
                <br /><br />
                ⏳ You can wait for your agreement approval, or if it is already approved, you can go ahead and log in to your dashboard.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://favorselect.com/seller-dashboard" style="background-color: #d63384; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
              </div>
              <p style="text-align: center; font-size: 14px; color: #666;">
                Need help? Contact us at <a href="mailto:support@favorselect.com" style="color: #d63384;">support@favorselect.com</a>.
              </p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="text-align: center; font-size: 13px; color: #aaa;">
                © ${new Date().getFullYear()} FavorSelect. All rights reserved.
              </p>
            </div>
          </div>
        `
      });
  
      console.log("Seller approval email sent successfully:", response);
    } catch (error) {
      console.error("Error sending seller approval email:", error);
    }
  };

  const sendApprovalRejectEmail = async (email, sellerName) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <favorselect113@gmail.com>',
        to: email,
        subject: " Seller Account Approval Rejected - FavorSelect",
        text: `Hi ${sellerName},\n\nWe regret to inform you that your seller account request has been rejected after review.\n\nThis may be due to incomplete or invalid information provided during registration. Please feel free to reach out to our support team if you have any questions or would like to reapply.\n\n- FavorSelect Team`,
        html: `
          <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="${logo}" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
              </div>
              <h2 style="text-align: center; padding: 20px; background-color: #dc3545; border-radius: 6px; color: #ffffff;">Account Rejected</h2>
              <p style="text-align: center; font-size: 16px; color: #333; margin-top: 20px;">
                Hi <strong>${sellerName}</strong>,
              </p>
              <p style="text-align: center; font-size: 15px; color: #555; margin: 20px 0;">
                We're sorry to inform you that your seller account request has been rejected after review.
                <br /><br />
                 This might be due to missing, invalid, or unverifiable information.
                <br /><br />
                If you believe this is a mistake or you'd like to reapply, feel free to contact us.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:support@favorselect.com" style="background-color: #d63384; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Contact Support</a>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="text-align: center; font-size: 13px; color: #aaa;">
                © ${new Date().getFullYear()} FavorSelect. All rights reserved.
              </p>
            </div>
          </div>
        `
      });
  
      console.log("Approval rejection email sent successfully:", response);
    } catch (error) {
      console.error("Error sending approval rejection email:", error);
    }
  };
  
  
  const  sendSellerProfileUpdateEmail= async (email, fullName) => {
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
  const  sendSellerChangePasswordEmail = async (email, fullName) => {
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
  
  

  module.exports = {
    sendSellerApprovalEmail,
    sendWelcomeEmailToSeller,
    sendVerificationEmail,
    sendSellerProfileUpdateEmail,
    sendSellerChangePasswordEmail,
    sendApprovalRejectEmail,
    sendApprovedEmail
  }
  

  
  
  