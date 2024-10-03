import {
  NotFoundError,
  UnauthorizedError,
  validateIdParam,
} from "@semiheimerco/common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket-model";
const router = express.Router();

router.get(
  "/api/tickets/:id",
  ...validateIdParam(),
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    if (
      ticket.reservedBy &&
      (!req.currentUser || ticket.reservedBy !== req.currentUser.id)
    ) {
      throw new UnauthorizedError(
        "You are not authorized to view this reserved ticket."
      );
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter };
