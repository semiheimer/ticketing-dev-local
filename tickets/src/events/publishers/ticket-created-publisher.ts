import { Publisher, Subjects, TicketCreatedEvent } from "@semiheimerco/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
