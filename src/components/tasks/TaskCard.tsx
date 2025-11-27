import { Task, Employee } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  assignedEmployee?: Employee;
  onClick?: () => void;
}

export function TaskCard({ task, assignedEmployee, onClick }: TaskCardProps) {
  const getPriorityClass = (priority: Task['priority']) => {
    return {
      low: 'priority-badge priority-low',
      medium: 'priority-badge priority-medium',
      high: 'priority-badge priority-high',
    }[priority];
  };

  const getStatusBadge = (status: Task['status']) => {
    const styles = {
      pending: 'bg-muted text-muted-foreground',
      'in-progress': 'bg-info/10 text-info border-info/20',
      completed: 'bg-success/10 text-success border-success/20',
    };
    return styles[status];
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30 animate-fade-in"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={getPriorityClass(task.priority)}>
                {task.priority}
              </span>
              <Badge variant="outline" className={cn('text-xs', getStatusBadge(task.status))}>
                {task.status.replace('-', ' ')}
              </Badge>
            </div>
            <h3 className="font-semibold text-foreground line-clamp-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
          </div>
        </div>

        {/* Required Skills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {task.requiredSkills.map((skill) => (
            <span key={skill} className="skill-chip">
              {skill}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(task.deadline), 'MMM dd')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {task.estimatedHours}h
            </span>
          </div>
        </div>

        {/* Assigned Employee */}
        {assignedEmployee ? (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={assignedEmployee.avatar} />
              <AvatarFallback className="text-xs">
                {assignedEmployee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{assignedEmployee.name}</span>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="text-sm">Unassigned</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
