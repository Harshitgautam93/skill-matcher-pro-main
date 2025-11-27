import { Employee } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Mail, Briefcase } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const getWorkloadColor = (workload: number) => {
    if (workload < 40) return 'bg-success';
    if (workload < 70) return 'bg-warning';
    return 'bg-destructive';
  };

  const getAvailabilityBadge = (availability: Employee['availability']) => {
    const styles = {
      available: 'bg-success/10 text-success border-success/20',
      busy: 'bg-warning/10 text-warning border-warning/20',
      unavailable: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return styles[availability];
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 animate-fade-in"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/10">
            <AvatarImage src={employee.avatar} alt={employee.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">{employee.name}</h3>
              <Badge variant="outline" className={cn('text-xs', getAvailabilityBadge(employee.availability))}>
                {employee.availability}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{employee.role}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {employee.department}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {employee.experience}y exp
              </span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {employee.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
          {employee.skills.length > 4 && (
            <span className="skill-chip bg-muted text-muted-foreground border-muted">
              +{employee.skills.length - 4}
            </span>
          )}
        </div>

        {/* Workload */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Workload</span>
            <span className="font-medium">{employee.workload}%</span>
          </div>
          <div className="workload-bar">
            <div
              className={cn('workload-fill', getWorkloadColor(employee.workload))}
              style={{ width: `${employee.workload}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{employee.tasksCompleted}</p>
            <p className="text-xs text-muted-foreground">Tasks Done</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{employee.productivity}%</p>
            <p className="text-xs text-muted-foreground">Productivity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
