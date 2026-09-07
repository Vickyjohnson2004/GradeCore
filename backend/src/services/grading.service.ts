export interface GradeRule { min:number; max:number; grade:string; point:number }
export interface GradeResult { total:number; grade:string; gradePoint:number }
export function calculateGrade(ca:number, exam:number, rules:GradeRule[]): GradeResult {
  const total = Number((ca + exam).toFixed(2));
  const rule = rules.find(r => total >= r.min && total <= r.max);
  if (!rule) throw new Error('No grading rule matches score');
  return { total, grade:rule.grade, gradePoint:rule.point };
}
export function qualityPoint(creditUnit:number, gradePoint:number) { return Number((creditUnit * gradePoint).toFixed(2)); }
