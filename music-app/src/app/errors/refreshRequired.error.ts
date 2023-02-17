export class refreshRequiredError extends Error {
  status;
  constructor(message: string) {
    super(message),
    this.status = 403;
  }
}