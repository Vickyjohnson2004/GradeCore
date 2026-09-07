import { calculateGPA } from './gpa.service.js';
export function calculateCGPA(items:Array<{creditUnit:number;qualityPoint:number}>) { return calculateGPA(items); }
