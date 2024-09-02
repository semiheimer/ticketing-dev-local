import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket-model";
import { Order, OrderStatus } from "../../models/order-model";
import { natsWrapper } from "../../nats-wrapper";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
  // create a ticket with Ticket Model
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id,
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);

  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(StatusCodes.NO_CONTENT);

  // expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits a order cancelled event", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id,
  });
  await ticket.save();

  const user = global.signin();
  // make a request to create an order
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);
  console.log("🚀 ~ it ~ order:", order.id);
  // make a request to cancel the order
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(StatusCodes.NO_CONTENT);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
