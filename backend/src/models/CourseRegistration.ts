import { Schema, model } from 'mongoose';
const schema = new Schema({student:{type:Schema.Types.ObjectId,ref:'Student',required:true},course:{type:Schema.Types.ObjectId,ref:'Course',required:true},session:{type:Schema.Types.ObjectId,ref:'AcademicSession',required:true},semester:{type:String,enum:['FIRST','SECOND'],required:true}}, {timestamps:true});
schema.index({student:1,course:1,session:1,semester:1},{unique:true});
export const CourseRegistration = model('CourseRegistration',schema);
