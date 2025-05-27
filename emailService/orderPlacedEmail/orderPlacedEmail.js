const { transporter } = require("../../config/nodemailerConfig/emailConfigMiddleware");
const logo = process.env.LOGO;


const sendOrderEmail = async (email, customerName, orderId, productDetails) => {
  try {
    const products = Array.isArray(productDetails) ? productDetails : [productDetails];


    const productsHtml = products.map(item => `
      <div style="margin-bottom: 20px; text-align: left;">
        <p><strong>Product:</strong> ${item.productName}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
        <p><strong>Total:</strong> $${item.totalPrice.toFixed(2)}</p>
      </div>
    `).join("");

    const productsText = products.map(item => (
      `Product: ${item.productName}\nQuantity: ${item.quantity}\nPrice: $${item.price.toFixed(2)}\nTotal: $${item.totalPrice.toFixed(2)}\n`
    )).join("\n");

    const response = await transporter.sendMail({
      from: '"FavorSelect Team" <favorselect113@gmail.com>',
      to: email,
      subject: "Order Confirmation - FavorSelect",
      text: `Hi ${customerName},\n\nThank you for your order!\n\nOrder ID: ${orderId}\n\n${productsText}\nWe’ll notify you when your order ships.\n\n- FavorSelect Team`,
      html: `
        <div style="background-color: #f3f4f6; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="${logo}" alt="FavorSelect" style="max-height: 60px;" onerror="this.style.display='none';" />
            </div>
            <h2 style="text-align: center; padding: 20px; background-color: #0d6efd; border-radius: 6px; color: #ffffff;">Order Confirmation</h2>
            <p style="text-align: center; font-size: 16px; color: #333;">Hi <strong>${customerName}</strong>,</p>
            <p style="text-align: center; font-size: 15px; color: #555;">Thank you for your purchase! Here are your order details:</p>
            <div style="margin: 30px 0;">
              <p style="text-align: center;"><strong>Order ID:</strong> ${orderId}</p>
              ${productsHtml}
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="text-align: center; font-size: 13px; color: #aaa;">© ${new Date().getFullYear()} FavorSelect. All rights reserved.</p>
          </div>
        </div>
      `
    });

    console.log(" Order confirmation email sent:", response);
  } catch (error) {
    console.error(" Error sending order confirmation email:", error);
  }
};

module.exports = { sendOrderEmail };

