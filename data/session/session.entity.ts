export class Session {
  id: string;
  title: string;
  date: string;
  tickets: Ticket[];
}

export class Ticket {
  id: string;
  title: string;
  url: string;
}
