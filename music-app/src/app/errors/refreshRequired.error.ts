import { StatusCodes } from '../enums/statusCodes';

export class RefreshRequiredError extends Error {
  status;

  constructor(message: string) {
    super(message);
    this.status = StatusCodes.RefreshRequired;
  }
}
