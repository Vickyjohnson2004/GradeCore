import { Schema, model } from 'mongoose';
const schema = new Schema({user:{type:Schema.Types.ObjectId,ref:'User',required:true,unique:true},staffNo:{type:String,required:true,unique:true,index:true},fullName:{type:String,required:true},email:{type:String,required:true},department:{type:Schema.Types.ObjectId,ref:'Department',required:true}}, {timestamps:true});
export const Lecturer = model('Lecturer',schema);
