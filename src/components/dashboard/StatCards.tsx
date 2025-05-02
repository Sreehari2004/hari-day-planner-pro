
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Briefcase, CheckSquare, IndianRupee } from 'lucide-react';
import { Task } from '@/redux/taskSlice';
import { Expense } from '@/redux/expenseSlice';
import { StudySession } from '@/redux/studySlice';
import { Project } from '@/redux/projectSlice';
import { calculatePercentage } from '@/lib/utils';

interface StatCardsProps {
  tasks: Task[];
  expenses: Expense[];
  studySessions: StudySession[];
  projects: Project[];
  budget: number;
}

export const StatCards: React.FC<StatCardsProps> = ({ 
  tasks, 
  expenses, 
  studySessions, 
  projects,
  budget 
}) => {
  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalStudyTime = studySessions.reduce((sum, session) => 
    session.completed ? sum + session.duration : sum, 0);
  
  const projectProgress = projects.length > 0
    ? projects.reduce((sum, project) => sum + project.progress, 0) / projects.length
    : 0;
  
  const budgetPercentage = budget > 0 
    ? Math.min(100, Math.round((totalExpenses / budget) * 100)) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
          <CheckSquare className="h-4 w-4 text-planner-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {completedTasks}/{tasks.length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {calculatePercentage(completedTasks, tasks.length)}% complete
          </p>
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Budget Usage</CardTitle>
          <IndianRupee className="h-4 w-4 text-planner-green" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {budgetPercentage}% of budget used
          </p>
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
          <BookOpen className="h-4 w-4 text-planner-blue" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(totalStudyTime / 60)}h {totalStudyTime % 60}m
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {studySessions.length} total sessions
          </p>
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
          <Briefcase className="h-4 w-4 text-planner-amber" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round(projectProgress)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {projects.length} active projects
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
