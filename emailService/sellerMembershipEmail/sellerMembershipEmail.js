const { transporter } = require("../../config/nodemailerConfig/emailConfigMiddleware");
const logo = process.env.LOGO;
const sendMembershipAssignedEmail = async (email, sellerName, planName, startDate, endDate) => {
  try {
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <favorselect113@gmail.com>',
      to: email,
      subject: " Membership Assigned - FavorSelect",
      text: `Hi ${sellerName},\n\nYou have been subscribed to a new membership plan.\n\nPlan: ${planName}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nThank you for being a part of FavorSelect!\n\n- FavorSelect Team`,
      html: `
        <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logo}" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
            </div>
            <h2 style="text-align: center; padding: 20px; background-color: #198754; border-radius: 6px; color: #ffffff;">Membership Assigned</h2>
            <p style="text-align: center; font-size: 16px; color: #333;">Hi <strong>${sellerName}</strong>,</p>
            <p style="text-align: center; font-size: 15px; color: #555;">You have been subscribed to the <strong>${planName}</strong> membership plan.</p>
            <div style="text-align: center; margin: 30px 0;">
              <p><strong>Start Date:</strong> ${new Date(startDate).toDateString()}</p>
              <p><strong>End Date:</strong> ${new Date(endDate).toDateString()}</p>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="text-align: center; font-size: 13px; color: #aaa;">© ${new Date().getFullYear()} FavorSelect. All rights reserved.</p>
          </div>
        </div>
      `
    });

    console.log("Membership assigned email sent:", response);
  } catch (error) {
    console.error("Error sending membership assigned email:", error);
  }
};


const sendMembershipRenewalEmail = async (email, sellerName, planName, startDate, endDate) => {
  try {
    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <favorselect113@gmail.com>',
      to: email,
      subject: " Membership Renewed - FavorSelect",
      text: `Hi ${sellerName},\n\nYour membership has been renewed.\n\nPlan: ${planName}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n\nThanks for staying with us!\n\n- FavorSelect Team`,
      html: `
        <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logo}" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
            </div>
            <h2 style="text-align: center; padding: 20px; background-color: #0d6efd; border-radius: 6px; color: #ffffff;">Membership Renewed</h2>
            <p style="text-align: center; font-size: 16px; color: #333;">Hi <strong>${sellerName}</strong>,</p>
            <p style="text-align: center; font-size: 15px; color: #555;">Your <strong>${planName}</strong> membership has been successfully renewed.</p>
            <div style="text-align: center; margin: 30px 0;">
              <p><strong>Start Date:</strong> ${new Date(startDate).toDateString()}</p>
              <p><strong>End Date:</strong> ${new Date(endDate).toDateString()}</p>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="text-align: center; font-size: 13px; color: #aaa;">© ${new Date().getFullYear()} FavorSelect. All rights reserved.</p>
          </div>
        </div>
      `
    });

    console.log("Membership renewal email sent:", response);
  } catch (error) {
    console.error("Error sending membership renewal email:", error);
  }
};


const sendPreExpiryEmailToSeller = async (email, planName, duration) => {
  try {
    await transporter.sendMail({
      from: '"FavorSelect Membership" <favorselect113@gmail.com>',
      to: email,
      subject: " Your Membership is Expiring Soon!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #dc3545;">Membership Expiry Reminder</h2>
            <p>Dear Seller,</p>
            <p>Your <strong>${planName}</strong> plan (duration: <strong>${duration}</strong>) will expire in <strong>10 days</strong>.</p>
            <p>To continue enjoying all benefits, please renew your membership before the expiry date.</p>
            <p><a href="https://favorselect.com/renew" style="color: #fff; background: #28a745; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Renew Now</a></p>
            <br/>
            <p>Thank you,<br/>FavorSelect Team</p>
          </div>
        </div>
      `
    });
    console.log("Pre-expiry email sent to:", email);
  } catch (err) {
    console.error("Error sending pre-expiry email:", err.message);
  }
};


const sendExpiryEmailToSeller = async (email, planName, duration) => {
  try {
    await transporter.sendMail({
      from: '"FavorSelect Membership" <favorselect113@gmail.com>',
      to: email,
      subject: " Your Membership Has Expired",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: auto; background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #dc3545;">Membership Expired</h2>
            <p>Dear Seller,</p>
            <p>Your <strong>${planName}</strong> plan (duration: <strong>${duration}</strong>) has <strong>expired</strong>.</p>
            <p>You no longer have access to premium features. Please renew your membership to continue selling on FavorSelect.</p>
            <p><a href="https://favorselect.com/renew" style="color: #fff; background: #007bff; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Renew Membership</a></p>
            <br/>
            <p>Thank you,<br/>FavorSelect Team</p>
          </div>
        </div>
      `
    });
    console.log("Expiry email sent to:", email);
  } catch (err) {
    console.error("Error sending expiry email:", err.message);
  }
};
module.exports = {sendMembershipAssignedEmail, sendExpiryEmailToSeller,sendPreExpiryEmailToSeller,sendMembershipRenewalEmail}
