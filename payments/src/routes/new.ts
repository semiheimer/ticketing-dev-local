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

    if (order.userId.toString() !== req.currentUser!.id) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("The order is already completed");
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: order.price * 100,
        payment_method_types: ["card"],
        metadata: {
          orderId: order.id,
        },
      });

      const payment = Payment.build({
        orderId,
        stripeId: paymentIntent.id,
      });

      await payment.save();

      new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });

      console.log("Published Payment", {
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });

      res.status(201).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Payment failed:", error);
      res
        .status(500)
        .send({ error: "Payment processing failed. Please try again." });
    }
  }
);

export { router as createChargeRouter };
