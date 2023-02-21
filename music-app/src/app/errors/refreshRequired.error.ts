import { StatusCodes } from "../enums/StatusCodes";

export class refreshRequiredError extends Error {
  status;
  constructor(message: string) {
    super(message),
    this.status = StatusCodes.RefreshRequired;
  }
}