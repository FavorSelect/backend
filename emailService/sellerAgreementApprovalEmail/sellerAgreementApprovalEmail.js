const { transporter } = require("../../config/nodemailerConfig/emailConfigMiddleware");

const sendAgreementSubmissionEmailToSeller = async (email, name) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <i.sksingh113@gmail.com>',
        to: email,
        subject: "Agreement Submitted Successfully - FavorSelect",
        text: `Hi ${name}, your agreement has been submitted successfully. Our team will review your details and get back to you shortly.`,
        html: `
          <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; padding: 20px;
                      border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif;">
            <h2 style="color: #1e88e5; font-size: 24px; text-align: center; margin-bottom: 15px;">
              Agreement Submitted Successfully
            </h2>
            <p style="color: #333333; font-size: 18px; text-align: center; line-height: 1.6;">
              Hello <strong>${name}</strong>,
            </p>
            <p style="color: #555555; font-size: 16px; text-align: center; line-height: 1.6;">
              Thank you for submitting your seller agreement on <strong>FavorSelect</strong>. We have received your submission and our team will review the provided documents and details shortly.
            </p>
            <p style="color: #555555; font-size: 16px; text-align: center; margin-top: 20px;">
              Once approved, you will be notified via email.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://favorselect.com" target="_blank" 
                style="background-color: #1e88e5; color: #ffffff; padding: 12px 24px; text-decoration: none;
                       font-size: 18px; border-radius: 5px; display: inline-block;">
                Visit FavorSelect
              </a>
            </div>
            <p style="color: #555555; font-size: 16px; text-align: center; margin-top: 30px;">
              Best Regards,<br>
              <strong style="color: #1e88e5;">FavorSelect Team</strong>
            </p>
          </div>
        `,
      });
  
      console.log("Agreement submission confirmation email sent to seller:", response);
    } catch (error) {
      console.error("Error sending seller agreement confirmation email:", error);
    }
  };

  const sendApprovedSellerAgreementEmail = async (email, sellerName) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <support@favorselect.com>',
        to: email,
        subject: " Seller Approval Confirmation - FavorSelect",
        text: `Hi ${sellerName},\n\nCongratulations! Your seller account on FavorSelect has been approved.\n\nYou can now access your dashboard and start listing your products.\n\nIf you have any questions, feel free to reach out to our support team.\n\nWelcome aboard!\n\n- FavorSelect Team`,
        html: `
          <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
              </div>
              <h2 style="text-align: center; padding: 20px; background-color:#198754; border-radius: 6px; color: #ffffff;">Seller Account Approved</h2>
              <p style="text-align: center; font-size: 16px; color: #333; margin-top: 20px;">
                Hi <strong>${sellerName}</strong>,<br /><br />
                🎉 Congratulations! Your seller account on <strong>FavorSelect</strong> has been successfully <strong>approved</strong>.
              </p>
              <p style="text-align: center; font-size: 15px; color: #555; margin: 30px 0;">
                You can now log in to your dashboard, upload your products, and begin selling to our customers.
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://favorselect.com/seller-dashboard" style="background-color: #d63384; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
                If you have any questions or concerns, please contact our support team at <a href="mailto:support@favorselect.com">support@favorselect.com</a>.
              </p>
              <p style="text-align: center; font-size: 13px; color: #aaa; margin-top: 30px;">
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

  const sendAgreementApprovalRejectEmail = async (email, sellerName) => {
    try {
      const response = await transporter.sendMail({
        from: '"FavorSelect Team" <support@favorselect.com>',
        to: email,
        subject: " Seller Account Not Approved - FavorSelect",
        text: `Hi ${sellerName},\n\nWe regret to inform you that your seller account on FavorSelect has not been approved at this time.\n\nThis decision may be due to incomplete documentation or policy non-compliance.\n\nYou may contact our support team for more information.\n\n- FavorSelect Team`,
        html: `
          <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
            <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
              </div>
              <h2 style="text-align: center; padding: 20px; background-color:#dc3545; border-radius: 6px; color: #ffffff;">Seller Account Rejected</h2>
              <p style="text-align: center; font-size: 16px; color: #333; margin-top: 20px;">
                Hi <strong>${sellerName}</strong>,<br /><br />
                We’re sorry, but your seller account on <strong>FavorSelect</strong> could not be approved at this time.
              </p>
              <p style="text-align: center; font-size: 15px; color: #555; margin: 30px 0;">
                This might be due to incomplete information, documentation issues, or non-compliance with our seller policies.
              </p>
              <p style="text-align: center; font-size: 14px; color: #777;">
                You may review your application and re-apply, or reach out to our support team for clarification.
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="mailto:support@favorselect.com" style="background-color: #6c757d; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">Contact Support</a>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
              <p style="text-align: center; font-size: 13px; color: #aaa;">
                © ${new Date().getFullYear()} FavorSelect. All rights reserved.
              </p>
            </div>
          </div>
        `
      });
  
      console.log("Seller rejection email sent successfully:", response);
    } catch (error) {
      console.error("Error sending seller rejection email:", error);
    }
  };
  
  
  