import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { SearchFilter } from '@/components/common/SearchFilter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { employees as initialEmployees, tasks as initialTasks, allSkills } from '@/data/mockData';
import { Task } from '@/types';

export default function Tasks() {
  const [employees] = useState(initialEmployees);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Tab filter
    if (activeTab !== 'all') {
      result = result.filter((task) => task.status === activeTab);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      result = result.filter((task) =>
        selectedSkills.some((skill) => task.requiredSkills.includes(skill))
      );
    }

    return result;
  }, [tasks, searchQuery, selectedSkills, activeTab]);

  const handleAssignTask = (taskId: string, employeeId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, assignedTo: employeeId, status: 'in-progress' as const }
          : task
      )
    );
  };

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and assign tasks to your team members
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All <span className="text-xs bg-muted px-1.5 rounded">{taskCounts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-2">
            Pending <span className="text-xs bg-warning/20 text-warning px-1.5 rounded">{taskCounts.pending}</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="gap-2">
            In Progress <span className="text-xs bg-info/20 text-info px-1.5 rounded">{taskCounts['in-progress']}</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            Completed <span className="text-xs bg-success/20 text-success px-1.5 rounded">{taskCounts.completed}</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Search and Filters */}
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSkills={selectedSkills}
            onSkillsChange={setSelectedSkills}
            availableSkills={allSkills}
          />

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mt-4 mb-4">
            Showing {filteredTasks.length} tasks
          </p>

          {/* Task Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                assignedEmployee={employees.find((e) => e.id === task.assignedTo)}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tasks found matching your criteria.</p>
            </div>
          )}
        </div>
      </Tabs>

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
