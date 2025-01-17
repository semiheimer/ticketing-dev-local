import { Subjects, Publisher, OrderCancelledEvent } from "@semiheimerco/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

