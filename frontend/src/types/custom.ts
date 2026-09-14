export interface User {
    id: string;
    email: string;
    name: string | null;
};

export type ApiResponse<T> = 
  | { data: T }
  | { error: string };