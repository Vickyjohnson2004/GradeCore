export function calculateGPA(items:Array<{creditUnit:number;qualityPoint:number}>) {
  const credits=items.reduce((s,x)=>s+x.creditUnit,0);
  const quality=items.reduce((s,x)=>s+x.qualityPoint,0);
  return credits ? Number((quality/credits).toFixed(2)) : 0;
}
