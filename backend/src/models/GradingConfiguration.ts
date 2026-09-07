import { Schema, model } from 'mongoose';
const schema = new Schema({name:{type:String,required:true,unique:true},rules:[{min:{type:Number,required:true},max:{type:Number,required:true},grade:{type:String,required:true},point:{type:Number,required:true}}],caMax:{type:Number,default:30},examMax:{type:Number,default:70},isActive:{type:Boolean,default:true}}, {timestamps:true});
export const GradingConfiguration = model('GradingConfiguration',schema);
