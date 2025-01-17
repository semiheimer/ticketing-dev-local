import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@semiheimerco/common";
import { validateNewOrder } from "../middlewares/validation-middleware";
import { Ticket } from "../models/ticket-model";
import { Order } from "../models/order-model";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { EXPIRATION_WINDOW_SECONDS } from "../constants";

const router = express.Router();

router.post(
  "/api/orders",
  ...validateNewOrder,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // const isReserved = await ticket.isReserved();
    // if (isReserved) {
    //   throw new BadRequestError("Ticket is already reserved");
    // }

    const existingOrder = await ticket.isReserved();

    if (existingOrder) {
      if (existingOrder.status === OrderStatus.Complete) {
        throw new BadRequestError("The order already completed");
      }
      if (existingOrder?.userId.toString() === req.currentUser!.id) {
        return res.status(200).send(existingOrder);
      }
      throw new BadRequestError("Ticket is already reserved by another user");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = await Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
