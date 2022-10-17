import { AddTicketRequest, CreateSessionRequest } from "./create-session-request.dto";

export class Session {
  id: string;
  title: string;
  date: string;
  tickets: Ticket[];
  owner: string;

  static fromCreateSessionRequest(session: CreateSessionRequest, id: string, owner: string): Session {
    return {
      id,
      title: session.title,
      date: session.date,
      tickets: session.tickets.map((ticket) => Ticket.fromAddTicketRequest(ticket)),
      owner,
    };
  }
}

export class Ticket {
  title: string;
  url: string;

  static fromAddTicketRequest(ticket: AddTicketRequest): Ticket {
    return {
      title: ticket.title,
      url: ticket.url,
    };
  }
}
