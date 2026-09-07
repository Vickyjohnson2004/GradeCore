import { ResultAuditLog } from '../models/ResultAuditLog.js';
export async function audit(input:{user:string;action:string;resource:string;resourceId:string;previousValue?:unknown;newValue?:unknown;metadata?:unknown}) {
  await ResultAuditLog.create(input);
}
