const { transporter } = require("../../config/nodemailerConfig/emailConfigMiddleware");

const logo = process.env.LOGO;
const sendSellerTicketCreationEmail = async (email, fullName, ticketNumber, subject) => {
  try {
    const response = await transporter.sendMail({
      from: '"FavorSelect Seller Support" <favorselect113@gmail.com>',
      to: email,
      subject: `🎫 Seller Ticket Created - FavorSelect (#${ticketNumber})`,
      text: `Hi ${fullName},\n\nYour seller support ticket has been created successfully.\n\nTicket Number: ${ticketNumber}\nSubject: ${subject}\n\nOur team will review and respond shortly.\n\nThank you,\nFavorSelect Seller Support`,
      html: `
        <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logo}" alt="FavorSelect Logo" style="max-height: 60px;" />
            </div>
            <h2 style="text-align: center; padding: 20px; background-color:#198754; border-radius: 6px; color: #ffffff;">Seller Ticket Created</h2>
            <p style="font-size: 16px; text-align: center;">Hi <strong>${fullName}</strong>, your seller support ticket has been created successfully.</p>
            <div style="padding: 16px; margin: 20px 0; background-color: #f8f9fa; border-radius: 6px; text-align: center;">
              <p style="font-size: 20px; margin: 0;"><strong>Ticket Number:</strong> ${ticketNumber}</p>
              <p style="font-size: 16px; margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>
            <p style="text-align: center; color: #555; font-size: 15px;">Our seller support team will contact you shortly.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 14px; color: #666; text-align: center;">
              If you didn’t raise this ticket, you can safely ignore this email.
            </p>
            <p style="text-align: center; font-size: 13px; color: #aaa; margin-top: 30px;">
              © ${new Date().getFullYear()} FavorSelect. All rights reserved.
            </p>
          </div>
        </div>
      `
    });

    console.log("Seller ticket creation email sent successfully:", response);
  } catch (error) {
    console.error("Error sending seller ticket creation email:", error);
  }
};

const sendSellerTicketReplyEmail = async (email, fullName, ticketNumber, subject, adminReply, status) => {
  try {
    const response = await transporter.sendMail({
      from: '"FavorSelect Seller Support" <favorselect113@gmail.com>',
      to: email,
      subject: `🛠️ Seller Ticket #${ticketNumber} Update - ${status.toUpperCase()}`,
      html: `
        <div style="background-color: #f8f9fa; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <h2 style="text-align: center; background-color: #198754; padding: 15px; color: white; border-radius: 6px;">Seller Ticket Update</h2>
            <p>Hello <strong>${fullName}</strong>,</p>
            <p>Your seller support ticket <strong>#${ticketNumber}</strong> (<em>${subject}</em>) has been updated.</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Reply from Admin:</strong></p>
            <blockquote style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #198754; border-radius: 4px;">
              ${adminReply}
            </blockquote>
            <p>If you have further queries, feel free to reply or raise another ticket.</p>
            <p>Regards,<br/>FavorSelect Seller Support Team</p>
            <hr />
            <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} FavorSelect. All rights reserved.</p>
          </div>
        </div>
      `
    });

    console.log("Seller ticket reply email sent:", response);
  } catch (err) {
    console.error("Error sending seller ticket reply email:", err);
  }
};

module.exports = {
  sendSellerTicketCreationEmail,
  sendSellerTicketReplyEmail,
};
