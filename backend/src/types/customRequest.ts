import { Request } from "express";

export interface IUser {
  id: string;
  email: string;
}

export interface CustomRequest extends Request {
  user?: any;
  file?: any;
}