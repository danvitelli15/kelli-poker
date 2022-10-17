import { CreateAccoutnRequest } from "./create-account-request.dto";

export class Account {
  email: string;
  displayName: string;
  firstName?: string;
  id: string;
  lastName?: string;

  static fromCreateAccountRequest(request: CreateAccoutnRequest, id: string): Account {
    return {
      email: request.email,
      displayName: request.displayName,
      firstName: request.firstName,
      id,
      lastName: request.lastName,
    };
  }
}
