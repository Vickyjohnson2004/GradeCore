import type { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { ok, fail } from '../utils/api.js';
import { loginSchema } from '../validators/auth.js';
export const login:RequestHandler=async(req,res,next)=>{try{
 const body=loginSchema.parse(req.body); const user=await User.findOne({email:body.email}).select('+passwordHash');
 if(!user||!user.isActive||!(await bcrypt.compare(body.password,user.passwordHash))) return fail(res,'Invalid email or password',401);
 const token=jwt.sign({id:user.id,email:user.email,role:user.role},env.JWT_SECRET,{expiresIn:env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']});
 res.cookie('access_token',token,{httpOnly:true,secure:env.NODE_ENV==='production',sameSite:'lax',maxAge:86400000});
 return ok(res,'Login successful',{user:{id:user.id,email:user.email,role:user.role}});
 }catch(e){next(e)}};
export const logout:RequestHandler=async(_req,res)=>{res.clearCookie('access_token');return ok(res,'Logged out',null)};
export const me:RequestHandler=async(req,res)=>ok(res,'Current user',req.user);
