import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) return res.status(err.statusCode).json({success:false,message:err.message});
  if (err?.name === 'ZodError') return res.status(400).json({success:false,message:'Validation failed',errors:err.issues});
  if (err?.code === 11000) return res.status(409).json({success:false,message:'A record with that unique value already exists.'});
  console.error(err);
  return res.status(500).json({success:false,message:'Internal server error'});
};
