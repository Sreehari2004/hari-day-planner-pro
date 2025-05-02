
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatShortDate, getPriorityColor } from '@/lib/utils';
import { Task } from '@/redux/taskSlice';
import { StudySession } from '@/redux/studySlice';
import { Project } from '@/redux/projectSlice';
import { Meal } from '@/redux/foodSlice';
import { Badge } from '@/components/ui/badge';

interface UpcomingItemsProps {
  tasks: Task[];
  studySessions: StudySession[];
  projects: Project[];
  meals: Meal[];
}

export const UpcomingItems: React.FC<UpcomingItemsProps> = ({ 
  tasks, 
  studySessions, 
  projects, 
  meals 
}) => {
  // Filter incomplete tasks with due dates in the future, and sort by due date
  const upcomingTasks = tasks
    .filter(task => !task.completed && task.dueDate && new Date(task.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 3);
  
  // Filter incomplete study sessions in the future
  const upcomingStudy = studySessions
    .filter(session => !session.completed && new Date(session.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Get projects with closest deadlines
  const upcomingProjects = projects
    .filter(project => project.deadline && new Date(project.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3);
  
  // Filter upcoming meals
  const upcomingMeals = meals
    .filter(meal => !meal.completed && new Date(meal.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-3">
              {upcomingTasks.map(task => (
                <li key={task.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <span className="text-sm">{formatShortDate(task.dueDate!)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No upcoming tasks</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg">Study Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingStudy.length > 0 ? (
            <ul className="space-y-3">
              {upcomingStudy.map(session => (
                <li key={session.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{session.title}</div>
                    <div className="text-sm text-muted-foreground">{session.subject}</div>
                  </div>
                  <div>
                    <Badge variant="outline">{session.duration} min</Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No upcoming study sessions</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg">Project Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingProjects.length > 0 ? (
            <ul className="space-y-3">
              {upcomingProjects.map(project => (
                <li key={project.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{project.title}</div>
                    <div className="text-sm text-muted-foreground">{project.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{project.progress}%</span>
                    <span className="text-sm">{formatShortDate(project.deadline!)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No upcoming deadlines</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="text-lg">Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingMeals.length > 0 ? (
            <ul className="space-y-3">
              {upcomingMeals.map(meal => (
                <li key={meal.id} className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{meal.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">{meal.category}</div>
                  </div>
                  <div>
                    <span className="text-sm">{formatShortDate(meal.date)}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No upcoming meals planned</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
