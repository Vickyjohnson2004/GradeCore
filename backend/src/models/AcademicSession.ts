import { Schema, model } from 'mongoose';
const schema = new Schema({name:{type:String,required:true,unique:true},isActive:{type:Boolean,default:false},semesters:[{type:String,enum:['FIRST','SECOND']} ]}, {timestamps:true});
export const AcademicSession = model('AcademicSession',schema);
