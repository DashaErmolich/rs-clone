import { StatusCodes } from '../enums/status-codes';

export class RefreshRequiredError extends Error {
  status;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.RefreshRequired;
  }
}
