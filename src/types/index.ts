export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  role: string;
  skills: string[];
  workload: number; // 0-100
  availability: 'available' | 'busy' | 'unavailable';
  experience: number; // years
  tasksCompleted: number;
  productivity: number; // 0-100
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  requiredSkills: string[];
  assignedTo?: string;
  deadline: string;
  estimatedHours: number;
  createdAt: string;
}

export interface EmployeeRecommendation {
  employee: Employee;
  score: number;
  matchedSkills: string[];
  reasons: string[];
}

export type SortField = 'name' | 'workload' | 'experience' | 'productivity';
export type SortOrder = 'asc' | 'desc';
