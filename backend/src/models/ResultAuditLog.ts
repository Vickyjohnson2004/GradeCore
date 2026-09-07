import { Schema, model } from 'mongoose';
const schema = new Schema({user:{type:Schema.Types.ObjectId,ref:'User',required:true},action:{type:String,required:true},resource:{type:String,required:true},resourceId:{type:String,required:true},previousValue:Schema.Types.Mixed,newValue:Schema.Types.Mixed,metadata:Schema.Types.Mixed}, {timestamps:true});
schema.index({resource:1,resourceId:1,createdAt:-1});
export const ResultAuditLog = model('ResultAuditLog',schema);
