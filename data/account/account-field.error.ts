export class AccountFieldError extends Error {
  constructor(message: string, public field: string) {
    super(message);
  }
}
