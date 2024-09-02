import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, ExpirationCompleteEvent } from "@semiheimerco/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order-model";
import { Ticket } from "../../../models/ticket-model";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: "66d59f0e9a45fea37ae15ccb",
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "alskdfj",
    expiresAt: new Date(),
    ticket,
  });
  console.log(order, "orderrrrrrrrrrr");

  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // {"id":"667e5966f63cc01a5b465ab7","version":1,"ticket":{"id":"667e5966f63cc01a5b465ab4"}
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[1][1] //[0][1]=>version 0, [1][1]=)>version 1
  );

  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
