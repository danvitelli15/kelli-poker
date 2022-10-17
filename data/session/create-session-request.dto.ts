export class CreateSessionRequest {
  title: string;
  date: string;
  tickets: AddTicketRequest[];
}

export class AddTicketRequest {
  title: string;
  url: string;
}
