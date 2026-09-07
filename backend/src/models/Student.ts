import { Schema, model } from 'mongoose';
const schema = new Schema({user:{type:Schema.Types.ObjectId,ref:'User',required:true,unique:true},matricNo:{type:String,required:true,unique:true,index:true},fullName:{type:String,required:true},email:{type:String,required:true},department:{type:Schema.Types.ObjectId,ref:'Department',required:true},level:{type:Number,required:true,min:100,max:800},isActive:{type:Boolean,default:true}}, {timestamps:true});
schema.index({department:1,level:1});
export const Student = model('Student',schema);
