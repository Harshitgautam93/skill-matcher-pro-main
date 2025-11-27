import { Employee } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Mail, Phone, Calendar, Award, Target, TrendingUp } from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDetailModal({ employee, open, onOpenChange }: EmployeeDetailModalProps) {
  if (!employee) return null;

  const getAvailabilityBadge = (availability: Employee['availability']) => {
    const styles = {
      available: 'bg-success/10 text-success border-success/20',
      busy: 'bg-warning/10 text-warning border-warning/20',
      unavailable: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return styles[availability];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-4 ring-primary/10">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback className="text-xl">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{employee.name}</h2>
              <p className="text-muted-foreground">{employee.role}</p>
              <Badge variant="outline" className={cn('mt-2', getAvailabilityBadge(employee.availability))}>
                {employee.availability}
              </Badge>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{employee.experience} years experience</span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Target className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{employee.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <TrendingUp className="h-5 w-5 mx-auto text-success mb-2" />
              <p className="text-2xl font-bold">{employee.productivity}%</p>
              <p className="text-xs text-muted-foreground">Productivity</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Award className="h-5 w-5 mx-auto text-warning mb-2" />
              <p className="text-2xl font-bold">{employee.workload}%</p>
              <p className="text-xs text-muted-foreground">Workload</p>
            </div>
          </div>

          {/* Workload Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Current Workload</span>
              <span className="font-medium">{employee.workload}%</span>
            </div>
            <Progress value={employee.workload} className="h-2" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
