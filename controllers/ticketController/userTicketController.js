const Ticket = require("../../models/ticketModel/userTicketModel");
const User = require("../../models/authModel/userModel");
const { sendTicketReplyEmail, sendTicketCreationEmail } = require("../../emailService/supportTicketEmail/userSupportEmail");

const generateTicketNumber = async () => {
  let exists = true;
  let ticketNumber;

  while (exists) {
    ticketNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existing = await Ticket.findOne({ where: { ticketNumber } });
    exists = !!existing;
  }

  return ticketNumber;
};

// Create ticket (already shared)
const createTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const userId = req.user.id;
    const files = req.files;
    const imageUrl = files.imageUrl[0].location;

    const ticketNumber = await generateTicketNumber();

    const ticket = await Ticket.create({
      userId,
      subject,
      description,
      imageUrl: imageUrl,
      ticketNumber,
    });
    // Fetch user info for sending mail
    const user = await User.findByPk(userId);
    if (user?.email) {
      await sendTicketCreationEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        ticketNumber,
        subject
      );
    }
    res
      .status(201)
      .json({ message: "Ticket submitted successfully", ticketNumber, ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// USER: View my tickets
const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      where: { userId: req.user.id },
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

// ADMIN: View all tickets
const getAllTickets = async (req, res) => {
  try {
    const { status } = req.query;
    const whereCondition = status ? { status } : {}; // filter only if status provided
    const tickets = await Ticket.findAll({
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
        model: User,
        attributes: ["id", "firstName", "lastName", "email"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ tickets });
//If no status provided it return all tickets
    //GET /admin/tickets?status=open
    //GET /admin/tickets?status=closed
    //GET /admin/tickets?status=in-progress
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// ADMIN: Reply to ticket
const replyToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adminReply, status } = req.body;

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    ticket.adminReply = adminReply || ticket.adminReply;
    ticket.status = status || ticket.status;
    await ticket.save();
 // Send reply notification to user
    const user = ticket.User;
    await sendTicketReplyEmail(user.email, `${user.firstName} ${user.lastName}`, ticket.ticketNumber, ticket.subject, ticket.adminReply, ticket.status);

    res.status(200).json({ message: "Reply added successfully", ticket });
  } catch (error) {
    res.status(500).json({ error: "Failed to reply to ticket" });
  }
};

module.exports = {
  replyToTicket,
  getAllTickets,
  getMyTickets,
  createTicket,
};
