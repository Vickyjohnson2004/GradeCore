import { Schema, model } from 'mongoose';
import type { Role } from '../types/auth.js';
const schema = new Schema({email:{type:String,required:true,unique:true,index:true,lowercase:true},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:['ADMIN','LECTURER','STUDENT'] satisfies Role[],required:true},isActive:{type:Boolean,default:true}}, {timestamps:true});
export const User = model('User',schema);
