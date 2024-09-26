import {
  NotFoundError,
  UnauthorizedError,
  requireAuth,
  validateIdParam,
} from "@semiheimerco/common";
import express, { Request, Response } from "express";
import { Order } from "../models/order-model";
const router = express.Router();

router.get(
  "/api/orders/:orderId",
  ...validateIdParam("orderId"),
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order?.userId.toString() !== req.currentUser!.id) {
      throw new UnauthorizedError("You haven't placed any orders.");
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
