import { Publisher, OrderCreatedEvent, Subjects } from "@semiheimerco/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

