export interface UserPayload {
  id: string;
  email: string;
  isSuperadmin?: boolean;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}
