import { useState } from 'react';
import { Users, ClipboardList, CheckCircle, Clock, Plus } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { WorkloadChart } from '@/components/dashboard/WorkloadChart';
import { TaskChart } from '@/components/dashboard/TaskChart';
import { TopEmployees } from '@/components/dashboard/TopEmployees';
import { CompletionProgress } from '@/components/dashboard/CompletionProgress';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { Button } from '@/components/ui/button';
import { employees as initialEmployees, tasks as initialTasks } from '@/data/mockData';
import { Task } from '@/types';

export default function Dashboard() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const totalEmployees = employees.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  const workloadData = [
    { name: 'Low (<40%)', value: employees.filter(e => e.workload < 40).length, color: 'hsl(var(--success))' },
    { name: 'Medium (40-70%)', value: employees.filter(e => e.workload >= 40 && e.workload < 70).length, color: 'hsl(var(--warning))' },
    { name: 'High (>70%)', value: employees.filter(e => e.workload >= 70).length, color: 'hsl(var(--destructive))' },
  ];

  const taskChartData = [
    { month: 'Jan', completed: 45, pending: 12 },
    { month: 'Feb', completed: 52, pending: 18 },
    { month: 'Mar', completed: 61, pending: 15 },
    { month: 'Apr', completed: 48, pending: 22 },
    { month: 'May', completed: 58, pending: 10 },
  ];

  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const handleAssignTask = (taskId: string, employeeId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, assignedTo: employeeId, status: 'in-progress' as const }
          : task
      )
    );
  };

  const recentTasks = tasks.filter(t => t.status === 'pending').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your team overview.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          change="+2 this month"
          changeType="positive"
          icon={Users}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          change="+5 this week"
          changeType="positive"
          icon={ClipboardList}
          iconBg="bg-info/10"
          iconColor="text-info"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          change={`${completionRate}% completion rate`}
          changeType="positive"
          icon={CheckCircle}
          iconBg="bg-success/10"
          iconColor="text-success"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          change="Action needed"
          changeType="negative"
          icon={Clock}
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskChart data={taskChartData} />
        </div>
        <CompletionProgress percentage={completionRate} label="Task Completion" />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WorkloadChart data={workloadData} />
        <TopEmployees employees={employees} />
        
        {/* Recent Tasks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Pending Tasks</h2>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignedEmployee={employees.find(e => e.id === task.assignedTo)}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        employees={employees}
        open={!!selectedTask}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onAssign={handleAssignTask}
      />
    </div>
  );
}
