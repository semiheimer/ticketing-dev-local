import { Publisher, Subjects, TicketUpdatedEvent } from "@semiheimerco/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

