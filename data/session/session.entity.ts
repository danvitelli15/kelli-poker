import { AddTicketRequest, CreateSessionRequest } from "./create-session-request.dto";

export enum TicketType {
  Bug = "bug",
  Spike = "spike",
  Story = "story",
  Task = "task",
}

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
  type: TicketType;
  url: string;

  static fromAddTicketRequest(ticket: AddTicketRequest): Ticket {
    return {
      title: ticket.title,
      type: ticket.type,
      url: ticket.url,
    };
  }
}
