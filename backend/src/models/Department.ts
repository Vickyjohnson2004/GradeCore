import { Schema, model } from 'mongoose';
const schema = new Schema({name:{type:String,required:true,unique:true},code:{type:String,required:true,unique:true}}, {timestamps:true});
export const Department = model('Department',schema);
