import { useState, useMemo } from 'react';
import { EmployeeCard } from '@/components/employees/EmployeeCard';
import { EmployeeDetailModal } from '@/components/employees/EmployeeDetailModal';
import { SearchFilter } from '@/components/common/SearchFilter';
import { employees as initialEmployees, allSkills } from '@/data/mockData';
import { Employee } from '@/types';

const sortOptions = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'workload-asc', label: 'Workload (Low)' },
  { value: 'workload-desc', label: 'Workload (High)' },
  { value: 'experience-desc', label: 'Experience (High)' },
  { value: 'productivity-desc', label: 'Productivity (High)' },
];

export default function Employees() {
  const [employees] = useState(initialEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');

  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      result = result.filter((emp) =>
        selectedSkills.some((skill) => emp.skills.includes(skill))
      );
    }

    // Availability filter
    if (availability !== 'all') {
      result = result.filter((emp) => emp.availability === availability);
    }

    // Sorting
    const [field, order] = sortBy.split('-');
    result.sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'workload':
          comparison = a.workload - b.workload;
          break;
        case 'experience':
          comparison = a.experience - b.experience;
          break;
        case 'productivity':
          comparison = a.productivity - b.productivity;
          break;
      }
      return order === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [employees, searchQuery, selectedSkills, availability, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Employees</h1>
        <p className="text-muted-foreground mt-1">
          Manage your team members and view their profiles
        </p>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSkills={selectedSkills}
        onSkillsChange={setSelectedSkills}
        availableSkills={allSkills}
        availability={availability}
        onAvailabilityChange={setAvailability}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={sortOptions}
      />

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredEmployees.length} of {employees.length} employees
      </p>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={() => setSelectedEmployee(employee)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found matching your criteria.</p>
        </div>
      )}

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      />
    </div>
  );
}
