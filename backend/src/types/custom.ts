import type { Request } from 'express';

export type UserPayload = {
  id: string;
  email: string;
  name: string | null;
};

export type AuthUser = {
  id: string;
};

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export type ApiResponse<T> =
  | { data: T }
  | { error: string };