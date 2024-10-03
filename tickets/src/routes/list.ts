import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket-model";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});
  const filteredTickets = tickets.filter((ticket) => {
    return (
      !ticket?.reservedBy ||
      (req.currentUser && ticket?.reservedBy === req.currentUser.id)
    );
  });
  res.send(filteredTickets);
});

export { router as indexTicketRouter };
