const SellerTicket = require("../../models/ticketModel/sellerTicketModel");
const Seller = require("../../models/sellerModel/sellerModel");
const {
  sendSellerTicketReplyEmail,
  sendSellerTicketCreationEmail,
} = require("../../emailService/supportTicketEmail/sellerSupportEmail");

const generateTicketNumber = async () => {
  let exists = true;
  let ticketNumber;

  while (exists) {
    ticketNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existing = await SellerTicket.findOne({ where: { ticketNumber } });
    exists = !!existing;
  }

  return ticketNumber;
};

// Create ticket
const createSellerTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const sellerId = req.seller.id; // Make sure seller middleware sets this
    const files = req.files;
    const imageUrl = files?.imageUrl?.[0]?.location || null;

    const ticketNumber = await generateTicketNumber();

    const ticket = await SellerTicket.create({
      sellerId,
      subject,
      description,
      imageUrl,
      ticketNumber,
    });

    const seller = await Seller.findByPk(sellerId);

    if (seller?.email) {
      await sendSellerTicketCreationEmail(
        seller.email,
        `${seller.firstName} ${seller.lastName}`,
        ticketNumber,
        subject
      );
    }

    res.status(201).json({
      message: "Ticket submitted successfully",
      ticketNumber,
      ticket,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// SELLER: View my tickets
const getMyTicketsSeller = async (req, res) => {
  try {
    const tickets = await SellerTicket.findAll({
      where: { sellerId: req.seller.id },
      attributes: [
        "id",
        "ticketNumber",
        "subject",
        "description",
        "status",
        "adminReply",
        "imageUrl",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your tickets" });
  }
};

// ADMIN: View all seller tickets
const getAllTicketsSeller = async (req, res) => {
  try {
    const { status } = req.query;
    const whereCondition = status ? { status } : {};
    const tickets = await SellerTicket.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "ticketNumber",
        "subject",
        "description",
        "status",
        "adminReply",
        "imageUrl",
        "createdAt",
      ],
      include: {
        model: Seller,
        attributes: ["id", "firstName", "lastName", "email"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// ADMIN: Reply to seller ticket
const replyToTicketSeller = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adminReply, status } = req.body;

    const ticket = await SellerTicket.findByPk(ticketId, {
      include: {
        model: Seller,
        attributes: ["firstName", "lastName", "email"],
      },
    });

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.adminReply = adminReply || ticket.adminReply;
    ticket.status = status || ticket.status;
    await ticket.save();

    const seller = ticket.Seller;
    if (seller?.email) {
      await sendSellerTicketReplyEmail(
        seller.email,
        `${seller.firstName} ${seller.lastName}`,
        ticket.ticketNumber,
        ticket.subject,
        ticket.adminReply,
        ticket.status
      );
    }

    res.status(200).json({ message: "Reply added successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: "Failed to reply to ticket" });
  }
};

module.exports = {
  createSellerTicket,
  getMyTicketsSeller,
  getAllTicketsSeller,
  replyToTicketSeller,
};
