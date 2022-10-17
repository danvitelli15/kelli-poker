import { TicketType } from "./session.entity";

export class CreateSessionRequest {
  title: string;
  date: string;
  tickets: AddTicketRequest[];
}

export class AddTicketRequest {
  title: string;
  type: TicketType;
  url: string;
}
