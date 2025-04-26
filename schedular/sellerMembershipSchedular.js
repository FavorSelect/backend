const cron = require('node-cron');
const moment = require('moment');
const { Op } = require('sequelize');
const Seller = require('../models/authModel/sellerModel');
const Membership = require('../models/membershipModel/sellerMembershipModel');


cron.schedule('0 0 * * *', async () => {
  try {
    const sellers = await Seller.findAll({
      where: {
        membershipEnd: { [Op.ne]: null }
      },
      include: [Membership]
    });

    const currentDate = moment();

    for (const seller of sellers) {
      const membershipEnd = moment(seller.membershipEnd);
      const daysUntilExpiry = membershipEnd.diff(currentDate, 'days');

      if (daysUntilExpiry <= 0) {
        await sendExpiryEmailToSeller(seller.email, seller.membership.planName, seller.membership.duration);
      } else if (daysUntilExpiry === 10) {
        await sendPreExpiryEmailToSeller(seller.email, seller.membership.planName, seller.membership.duration);
      }
    }

    
    console.log('Checked membership expiry:', new Date().toDateString());
  } catch (error) {
    console.error('Error in seller membership cron job:', error.message);
  }
});
