import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@semiheimerco/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "alskdjf",
    userId: "alskdjf",
    status: OrderStatus.Created,
    ticket: {
      id: "alskdfj",
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  // const msg: Message = {
  //   getSequence(): number {
  //     return 1;
  //   },
  //   getRawData(): Buffer {
  //     return Buffer.from("");
  //   },
  //   getSubject(): string {
  //     return "subject";
  //   },
  //   getTimestamp(): Date {
  //     return new Date();
  //   },
  //   getData(): string {
  //     return "";
  //   },
  //   isRedelivered(): boolean {
  //     return false;
  //   },
  //   getTimestampRaw(): number {
  //     return Date.now();
  //   },
  //   getCrc32(): number {
  //     return 1234567890;
  //   },
  //   ack: jest.fn(),
  // };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
