export type Role = 'ADMIN' | 'LECTURER' | 'STUDENT';
export interface AuthUser { id: string; role: Role; email: string; }
declare global { namespace Express { interface Request { user?: AuthUser } } }
