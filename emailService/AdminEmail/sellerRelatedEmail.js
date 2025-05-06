const transporter = require("../../config/nodemailerConfig/emailConfigMiddleware"); // Adjust path as per your setup

const sendAgreementSubmissionEmailToAdmin = async (sellerEmail, sellerName) => {
  try {
    const response = await transporter.sendMail({
      from: '"FavorSelect Alerts" <favorselect113@gmail.com>',
      to: "favorselect113@gmail.com", // Replace with actual admin email or use env variable
      subject: "New Seller Agreement Submitted",
      text: `Hello Admin,\n\nA new seller named ${sellerName} (${sellerEmail}) has submitted their agreement for approval.\n\nPlease log in to the admin dashboard to review and take appropriate action.\n\n- FavorSelect System`,
      html: `
        <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://your-favorselect-logo-url.com/logo.png" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
            </div>
            <h2 style="text-align: center; padding: 20px; background-color:#0d6efd; border-radius: 6px; color: #ffffff;">Seller Agreement Submitted</h2>
            <p style="text-align: center; font-size: 16px; color: #333; margin-top: 20px;">
              Hello Admin,<br /><br />
              A new seller has submitted their agreement for review.
            </p>
            <p style="text-align: center; font-size: 15px; color: #555; margin: 30px 0;">
              <strong>Seller Name:</strong> ${sellerName}<br />
              <strong>Email:</strong> ${sellerEmail}
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://favorselect.com/admin/seller-requests" style="background-color: #198754; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Review Now</a>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 14px; color: #666; text-align: center; line-height: 1.6;">
              This is an automated message from FavorSelect. If you believe this was sent in error, please contact support.
            </p>
            <p style="text-align: center; font-size: 13px; color: #aaa; margin-top: 30px;">
              © ${new Date().getFullYear()} FavorSelect. All rights reserved.
            </p>
          </div>
        </div>
      `
    });

    console.log("Agreement submission email sent to admin:", response);
  } catch (error) {
    console.error("Error sending agreement submission email to admin:", error);
  }
};

module.exports = sendAgreementSubmissionEmailToAdmin;
