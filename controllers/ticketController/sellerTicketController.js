const SellerTicket = require("../../models/ticketModel/sellerTicket");
const Seller = require("../../models/authModel/sellerModel");
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

const createSellerTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const userId = req.user.id;
    const image = req.file;
    const imageUrl = image?.location || null;

  
    const seller = await Seller.findOne({ where: { userId } });

    if (!seller) {
      return res.status(404).json({ error: "Seller account not found for this user" });
    }

    const ticketNumber = await generateTicketNumber();

    const ticket = await SellerTicket.create({
      sellerId: seller.id,
      subject,
      description,
       imageUrl,
      ticketNumber,
    });

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
        "image",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ tickets });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch your tickets" });
  }
};

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
        attributes: ["id", "sellerName", "email","contactNumber"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

const getTicketByIdSeller = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ error: "Ticket ID is required" });
    }
     
    const ticket = await SellerTicket.findOne({
      where: {id:ticketId },
      attributes: [
        "id",
        "ticketNumber",
        "subject",
        "description",
        "status",
        "adminReply",
        "imageUrl",
        "createdAt",
        "updatedAt",
      ],
      include: {
        model: Seller,
        attributes: ["id", "sellerName", "email", "contactNumber"],
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching seller ticket:", error);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};


const replyToTicketSeller = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adminReply, status } = req.body;

    const ticket = await SellerTicket.findByPk(ticketId, {
      include: {
        model: Seller,
        attributes: ["sellerName", "email","contactNumber"],
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
        `${seller.sellerName}`,
        ticket.ticketNumber,
        ticket.subject,
        ticket.adminReply,
        ticket.status
      );
    }

    res.status(200).json({ message: "Reply added successfully", ticket });
  } catch (error) {
      console.error("Error replying to seller ticket:", error);
    res.status(500).json({ error: "Failed to reply to ticket" });
  }
};

module.exports = {
  createSellerTicket,
  getMyTicketsSeller,
  getAllTicketsSeller,
  replyToTicketSeller,
   getTicketByIdSeller
};
