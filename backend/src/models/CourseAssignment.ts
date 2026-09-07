import { Schema, model } from 'mongoose';
const schema = new Schema({course:{type:Schema.Types.ObjectId,ref:'Course',required:true},lecturer:{type:Schema.Types.ObjectId,ref:'Lecturer',required:true},session:{type:Schema.Types.ObjectId,ref:'AcademicSession',required:true}}, {timestamps:true});
schema.index({course:1,lecturer:1,session:1},{unique:true});
export const CourseAssignment = model('CourseAssignment',schema);
