import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Employee } from '@/types';
import { Trophy } from 'lucide-react';

interface TopEmployeesProps {
  employees: Employee[];
}

export function TopEmployees({ employees }: TopEmployeesProps) {
  const topPerformers = [...employees]
    .sort((a, b) => b.productivity - a.productivity)
    .slice(0, 5);

  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
        <Trophy className="h-5 w-5 text-warning" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((employee, index) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{employee.tasksCompleted} tasks</p>
                <p className="text-xs text-muted-foreground">{employee.productivity}% productivity</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
