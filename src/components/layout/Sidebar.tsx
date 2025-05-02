
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarDays, BookOpen, Briefcase, DollarSign, Utensils, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <CalendarDays className="h-5 w-5" /> },
    { name: 'Study', path: '/study', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Projects', path: '/projects', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Expenses', path: '/expenses', icon: <DollarSign className="h-5 w-5" /> },
    { name: 'Meals', path: '/meals', icon: <Utensils className="h-5 w-5" /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare className="h-5 w-5" /> },
  ];

  return (
    <div className={cn(
      "bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <h1 className="text-xl font-bold">Day Planner</h1>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent transition-colors",
              location.pathname === item.path && "bg-sidebar-accent font-medium",
              collapsed ? "justify-center" : ""
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed ? (
          <div className="text-xs text-center">
            Hari's Day Planner Pro
          </div>
        ) : null}
      </div>
    </div>
  );
};
