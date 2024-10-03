export interface UserPayload {
  id: string;
  email: string;
  isSuperAdmin?: boolean;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload | null;
    }
  }
}
