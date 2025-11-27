import { Employee, Task, EmployeeRecommendation } from '@/types';

export function calculateMatchScore(employee: Employee, task: Task): EmployeeRecommendation {
  const matchedSkills = employee.skills.filter(skill => 
    task.requiredSkills.includes(skill)
  );
  
  // Skill match score (40% weight)
  const skillScore = (matchedSkills.length / task.requiredSkills.length) * 40;
  
  // Availability score (25% weight)
  let availabilityScore = 0;
  if (employee.availability === 'available') availabilityScore = 25;
  else if (employee.availability === 'busy') availabilityScore = 10;
  
  // Workload score (20% weight) - lower workload = higher score
  const workloadScore = ((100 - employee.workload) / 100) * 20;
  
  // Experience score (15% weight)
  const experienceScore = Math.min(employee.experience / 10, 1) * 15;
  
  const totalScore = Math.round(skillScore + availabilityScore + workloadScore + experienceScore);
  
  const reasons: string[] = [];
  if (matchedSkills.length === task.requiredSkills.length) {
    reasons.push('Perfect skill match');
  } else if (matchedSkills.length > 0) {
    reasons.push(`${matchedSkills.length}/${task.requiredSkills.length} skills matched`);
  }
  if (employee.availability === 'available') reasons.push('Currently available');
  if (employee.workload < 50) reasons.push('Low workload');
  if (employee.experience >= 5) reasons.push('Senior experience');
  if (employee.productivity >= 90) reasons.push('High productivity');
  
  return {
    employee,
    score: totalScore,
    matchedSkills,
    reasons,
  };
}

export function getTopRecommendations(
  employees: Employee[],
  task: Task,
  count: number = 3
): EmployeeRecommendation[] {
  return employees
    .filter(emp => !task.assignedTo || emp.id !== task.assignedTo)
    .map(emp => calculateMatchScore(emp, task))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}
