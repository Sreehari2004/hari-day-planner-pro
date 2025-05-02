
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'PPP');
}

export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM d');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function calculatePercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function groupByDate<T extends { date: string }>(items: T[]): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const date = item.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function groupByCategory<T extends { category: string }>(items: T[]): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const category = item.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function calculateTotalByCategory<T extends { amount: number; category: string }>(
  items: T[]
): Record<string, number> {
  return items.reduce((totals, item) => {
    const category = item.category || 'Uncategorized';
    if (!totals[category]) {
      totals[category] = 0;
    }
    totals[category] += item.amount;
    return totals;
  }, {} as Record<string, number>);
}

export function calculateDailyTotals<T extends { amount: number; date: string }>(
  items: T[]
): Record<string, number> {
  return items.reduce((totals, item) => {
    const date = item.date.split('T')[0];
    if (!totals[date]) {
      totals[date] = 0;
    }
    totals[date] += item.amount;
    return totals;
  }, {} as Record<string, number>);
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'low':
      return 'bg-blue-500';
    case 'medium':
      return 'bg-amber-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
}

export function getLastNDays(n: number): string[] {
  const result: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    result.push(date.toISOString().split('T')[0]);
  }
  return result;
}

export function getProgressColor(progress: number): string {
  if (progress < 30) return 'text-red-500';
  if (progress < 70) return 'text-amber-500';
  return 'text-green-500';
}
