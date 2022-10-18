import { AddTicketRequest, CreateSessionRequest } from "./create-session-request.dto";

export enum TicketType {
  Bug = "bug",
  Spike = "spike",
  Story = "story",
  Task = "task",
}

export class Session {
  activeTicketIndex: number;
  date: string;
  id: string;
  owner: string;
  participants: Participant[];
  tickets: Ticket[];
  title: string;

  static fromCreateSessionRequest(session: CreateSessionRequest, id: string, owner: string): Session {
    return {
      activeTicketIndex: -1,
      date: session.date,
      id,
      owner,
      participants: [],
      tickets: session.tickets.map((ticket) => Ticket.fromAddTicketRequest(ticket)),
      title: session.title,
    };
  }
}

export class Participant {
  name: string;
  votes: { [key: string]: string };
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
