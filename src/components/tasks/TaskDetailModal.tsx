import { useState } from 'react';
import { Task, Employee, EmployeeRecommendation } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Sparkles, Check, Star } from 'lucide-react';
import { format } from 'date-fns';
import { getTopRecommendations } from '@/utils/matching';
import { useToast } from '@/hooks/use-toast';

interface TaskDetailModalProps {
  task: Task | null;
  employees: Employee[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (taskId: string, employeeId: string) => void;
}

export function TaskDetailModal({ task, employees, open, onOpenChange, onAssign }: TaskDetailModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const { toast } = useToast();

  if (!task) return null;

  const recommendations = getTopRecommendations(employees, task, 3);
  const assignedEmployee = employees.find(e => e.id === task.assignedTo);

  const getPriorityClass = (priority: Task['priority']) => {
    return {
      low: 'priority-badge priority-low',
      medium: 'priority-badge priority-medium',
      high: 'priority-badge priority-high',
    }[priority];
  };

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(task.id, selectedEmployee);
      toast({
        title: 'Task Assigned',
        description: 'The task has been assigned successfully.',
      });
      onOpenChange(false);
    }
  };

  const handleRecommendedAssign = (employeeId: string) => {
    onAssign(task.id, employeeId);
    toast({
      title: 'Task Assigned',
      description: 'The task has been assigned to the recommended employee.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className={getPriorityClass(task.priority)}>{task.priority}</span>
            <DialogTitle>{task.title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{task.description}</p>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Due: {format(new Date(task.deadline), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Estimated: {task.estimatedHours} hours</span>
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {task.requiredSkills.map((skill) => (
                <span key={skill} className="skill-chip">{skill}</span>
              ))}
            </div>
          </div>

          {/* Current Assignment */}
          {assignedEmployee && (
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="text-sm font-semibold mb-3">Currently Assigned</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={assignedEmployee.avatar} />
                  <AvatarFallback>{assignedEmployee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{assignedEmployee.name}</p>
                  <p className="text-sm text-muted-foreground">{assignedEmployee.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Smart Recommendations */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">Smart Recommendations</h3>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.employee.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={rec.employee.avatar} />
                        <AvatarFallback>{rec.employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-warning flex items-center justify-center">
                          <Star className="h-3 w-3 text-warning-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{rec.employee.name}</p>
                      <p className="text-xs text-muted-foreground">{rec.employee.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.matchedSkills.map(skill => (
                          <span key={skill} className="text-xs px-1.5 py-0.5 rounded bg-success/10 text-success">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{rec.score}%</p>
                      <p className="text-xs text-muted-foreground">match</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleRecommendedAssign(rec.employee.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Assignment */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Or Select Manually</h3>
            <div className="flex gap-3">
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={emp.avatar} />
                          <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{emp.name}</span>
                        <span className="text-muted-foreground">({emp.workload}% workload)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAssign} disabled={!selectedEmployee}>
                Assign
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
