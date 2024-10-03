import { requireAuth, UnauthorizedError } from "@semiheimerco/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket-model";
import { validateCreateTicket } from "../middlewares/validation-middleware";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  ...validateCreateTicket,
  async (req: Request, res: Response) => {
    if (!req.currentUser!.isSuperAdmin) {
      throw new UnauthorizedError(
        "You are not authorized to create a new ticket"
      );
    }
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
