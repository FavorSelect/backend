const client = require('./twilioConfig');

const sendOTP = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log("Message sent:", message.sid);
  } catch (err) {
    console.error("Error sending OTP:", err);
  }
};

module.exports = sendOTP;
