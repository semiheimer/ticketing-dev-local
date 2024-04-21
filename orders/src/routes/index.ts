import express, { Request, Response } from "express";
import { Order } from "../models/order-model";
import { UnauthorizedError } from "@semiheimerco/common";
const router = express.Router();

router.get("/api/orders", async (req: Request, res: Response) => {
  if (!req.currentUser) {
    throw new UnauthorizedError();
  }
  const orders = await Order.find({
    userId: req.currentUser.id,
  }).populate("ticket");
  res.send(orders);
});

export { router as indexOrderRouter };
