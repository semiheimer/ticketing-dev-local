import { Subjects, Publisher, PaymentCreatedEvent } from "@semiheimerco/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
