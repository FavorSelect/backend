const UserTicket = require("../../models/ticketModel/userTicketModel");
const User = require("../../models/authModel/userModel");
const {
  sendUserTicketCreationEmail,
  sendUserTicketReplyEmail,
} = require("../../emailService/supportTicketEmail/userSupportEmail");
const { createUserNotification } = require("../notifications/userNotification");

const generateTicketNumber = async () => {
  let exists = true;
  let ticketNumber;

  while (exists) {
    ticketNumber = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existing = await UserTicket.findOne({ where: { ticketNumber } });
    exists = !!existing;
  }

  return ticketNumber;
};

const createUserTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const userId = req.user.id;
    const image = req.file;
    const imageUrl = image?.location || null;
    const ticketNumber = await generateTicketNumber();

    const ticket = await UserTicket.create({
      userId,
      subject,
      description,
      image: imageUrl,
      ticketNumber,
    });

    const user = await User.findByPk(userId);

    if (user?.email) {
      await sendUserTicketCreationEmail(
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

const getMyTicketsUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const tickets = await UserTicket.findAll({
      where: { userId },
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

const getTicketsByTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ error: "Ticket ID is required" });
    }

    const ticket = await UserTicket.findOne({
      where: { id: ticketId },
      attributes: [
        "id",
        "ticketNumber",
        "subject",
        "description",
        "status",
        "adminReply",
        "image",
        "createdAt",
        "updatedAt",
      ],
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "email", "phone"],
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};

const getAllTicketsUser = async (req, res) => {
  try {
    const { status } = req.query;
    const whereCondition = status ? { status } : {};
    const tickets = await UserTicket.findAll({
      where: whereCondition,
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
      include: {
        model: User,
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

const replyToTicketUser = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { adminReply, status } = req.body;
    const ticket = await UserTicket.findByPk(ticketId, {
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "email"],
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const originalStatus = ticket.status;
    const originalReply = ticket.adminReply;
    ticket.adminReply = adminReply || ticket.adminReply;
    ticket.status = status || ticket.status;

    await ticket.save();
    const user = ticket.User;

    if (user?.email) {
      await sendUserTicketReplyEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        ticket.ticketNumber,
        ticket.subject,
        ticket.adminReply,
        ticket.status
      );
    }
    if (user) {
      let messageParts = [];
      if (adminReply && adminReply !== originalReply) {
        messageParts.push("Admin replied to your support ticket.");
      }
      if (status && status !== originalStatus) {
        messageParts.push(`Status updated to: ${ticket.status}.`);
      }
      const notificationMessage = messageParts.join(" ");
      if (notificationMessage) {
        await createUserNotification({
          userId: user.id,
          title: "Support Ticket Update",
          message: `${notificationMessage} (Ticket: ${ticket.ticketNumber})`,
          type: "support",
          coverImage: null,
        });
      }
    }

    res.status(200).json({ message: "Reply added successfully", ticket });
  } catch (error) {
    console.error("Error replying to ticket:", error);
    res.status(500).json({ error: "Failed to reply to ticket" });
  }
};

module.exports = {
  replyToTicketUser,
  getAllTicketsUser,
  getMyTicketsUser,
  createUserTicket,
  getTicketsByTicketId,
};
