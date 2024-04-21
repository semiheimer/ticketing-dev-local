import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
  NotFoundError,
} from "@semiheimerco/common";
import { Ticket } from "../../models/ticket-model";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new NotFoundError("Ticket not found");
    }

    const { title, price, version } = data;
    ticket.set({ title, price, version: version });
    await ticket.save();
    console.log(ticket);
    msg.ack();
  }
}

