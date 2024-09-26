import express, { Request, Response } from "express";
import {
  ConflictError,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
  validateIdParam,
} from "@semiheimerco/common";
import { Ticket } from "../models/ticket-model";
import { validateUpdateTicket } from "../middlewares/validation-middleware";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  ...validateIdParam(),
  requireAuth,
  ...validateUpdateTicket,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId.toString() !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }

    //reserved tickets
    if (ticket.orderId) {
      throw new ConflictError("Cannot edit a reserved ticket");
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
