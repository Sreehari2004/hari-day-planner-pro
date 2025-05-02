
import React, { useMemo } from 'react';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { StatCards } from '@/components/dashboard/StatCards';
import { ProgressCharts } from '@/components/dashboard/ProgressCharts';
import { UpcomingItems } from '@/components/dashboard/UpcomingItems';
import { useAppSelector } from '@/redux/hooks';
import { getLastNDays, getTodayDateString, calculateTotalByCategory } from '@/lib/utils';
import { AppLayout } from '@/components/layout/AppLayout';

const Index = () => {
  const tasks = useAppSelector(state => state.tasks.tasks);
  const studySessions = useAppSelector(state => state.study.sessions);
  const expenses = useAppSelector(state => state.expenses.expenses);
  const projects = useAppSelector(state => state.projects.projects);
  const meals = useAppSelector(state => state.food.meals);
  const budget = useAppSelector(state => state.expenses.budget);

  // Prepare data for the task progress chart
  const taskProgressData = useMemo(() => {
    const last7Days = getLastNDays(7);
    
    return last7Days.map(date => {
      const dayTasks = tasks.filter(task => task.dueDate === date);
      const completed = dayTasks.filter(task => task.completed).length;
      const total = dayTasks.length;
      
      return {
        date,
        completed,
        total
      };
    });
  }, [tasks]);
  
  // Prepare data for the expense chart
  const expenseChartData = useMemo(() => {
    const totals = calculateTotalByCategory(expenses);
    return Object.entries(totals).map(([category, amount]) => ({
      category,
      amount
    }));
  }, [expenses]);
  
  return (
    <AppLayout>
      <WelcomeSection name="Hari" />
      
      <StatCards 
        tasks={tasks} 
        expenses={expenses} 
        studySessions={studySessions} 
        projects={projects}
        budget={budget}
      />
      
      <ProgressCharts 
        taskData={taskProgressData}
        expenseData={expenseChartData}
      />
      
      <UpcomingItems 
        tasks={tasks}
        studySessions={studySessions}
        projects={projects}
        meals={meals}
      />
    </AppLayout>
  );
};

export default Index;
