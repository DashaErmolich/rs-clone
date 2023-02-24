import { statusCodes } from '../enums/statusCodes';

export class refreshRequiredError extends Error {
  status;

  constructor(message: string) {
    super(message);
    this.status = statusCodes.RefreshRequired;
  }
}
