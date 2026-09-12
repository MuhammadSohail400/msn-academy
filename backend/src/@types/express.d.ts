export interface AuthenticatedUserPayload {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  fullName?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}
