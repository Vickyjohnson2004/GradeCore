import { Schema, model } from 'mongoose';
const schema = new Schema({code:{type:String,required:true,unique:true,index:true,uppercase:true},title:{type:String,required:true},creditUnit:{type:Number,required:true,min:1,max:12},department:{type:Schema.Types.ObjectId,ref:'Department',required:true},level:{type:Number,required:true},semester:{type:String,enum:['FIRST','SECOND'],required:true},isActive:{type:Boolean,default:true}}, {timestamps:true});
schema.index({department:1,level:1,semester:1});
export const Course = model('Course',schema);
