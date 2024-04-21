import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket-model";
import mongoose from "mongoose";

it("fetches the order", async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id,
  });
  await ticket.save();

  const user = await global.signin();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  // Create a ticket
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    id,
  });
  await ticket.save();

  const user1 = await global.signin();
  const user2 = await global.signin();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .send()
    .expect(401);
});

