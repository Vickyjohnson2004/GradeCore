import { Schema, model } from 'mongoose';
const schema = new Schema({
 student:{type:Schema.Types.ObjectId,ref:'Student',required:true}, course:{type:Schema.Types.ObjectId,ref:'Course',required:true},
 lecturer:{type:Schema.Types.ObjectId,ref:'Lecturer',required:true}, session:{type:Schema.Types.ObjectId,ref:'AcademicSession',required:true},
 semester:{type:String,enum:['FIRST','SECOND'],required:true}, ca:{type:Number,min:0,max:30,default:0}, exam:{type:Number,min:0,max:70,default:0},
 total:{type:Number,min:0,max:100,default:0}, grade:{type:String,default:'F'}, gradePoint:{type:Number,default:0}, qualityPoint:{type:Number,default:0},
 status:{type:String,enum:['DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','RELEASED'],default:'DRAFT',index:true},
 submittedAt:Date, approvedAt:Date, releasedAt:Date, rejectionReason:String
}, {timestamps:true});
schema.index({student:1,session:1,semester:1});
schema.index({course:1,session:1,semester:1});
schema.index({student:1,course:1,session:1,semester:1},{unique:true});
export const Result = model('Result',schema);
