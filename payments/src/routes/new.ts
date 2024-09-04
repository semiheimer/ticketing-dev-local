import express, { Request, Response } from "express";
import {
  requireAuth,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from "@semiheimerco/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { validateRequest } from "../middlewares/validation-middleware";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  ...validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    // new PaymentCreatedPublisher(natsWrapper.client).publish({
    //   id: payment.id,
    //   orderId: payment.orderId,
    //   stripeId: payment.stripeId,
    // });

    // res.status(201).send({ id: payment.id });
    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
