
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppLayout } from '@/components/layout/AppLayout';
import { formatDate, generateId, getTodayDateString, getPriorityColor } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { 
  addTask, 
  updateTask, 
  deleteTask, 
  toggleTask,
  addCategory,
  Task 
} from '@/redux/taskSlice';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Check, CheckSquare, Clock, ListChecks, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const TasksPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const tasks = useAppSelector(state => state.tasks.tasks);
  const categories = useAppSelector(state => state.tasks.categories);
  
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'completed' | 'createdAt'>>({
    title: '',
    description: '',
    dueDate: getTodayDateString(),
    priority: 'medium',
    category: 'Personal',
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (field: string, value: any) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskToAdd: Task = {
      ...newTask,
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addTask(taskToAdd));
    toast({
      title: 'Task Added',
      description: `${taskToAdd.title} has been added to your tasks.`,
    });
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      dueDate: getTodayDateString(),
      priority: 'medium',
      category: 'Personal',
    });
  };
  
  const handleToggleComplete = (id: string) => {
    dispatch(toggleTask(id));
  };
  
  const handleDeleteTask = (id: string, title: string) => {
    dispatch(deleteTask(id));
    toast({
      title: 'Task Deleted',
      description: `"${title}" has been removed from your tasks.`,
      variant: 'destructive',
    });
  };
  
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    dispatch(addCategory(newCategory));
    toast({
      title: 'Category Added',
      description: `${newCategory} has been added to your categories.`,
    });
    setNewCategory('');
  };
  
  // Filter tasks by category
  const filteredTasks = selectedCategory 
    ? tasks.filter(task => task.category === selectedCategory) 
    : tasks;
  
  // Separate completed and pending tasks
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  
  // Calculate completion percentage
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;
  
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          <span className="text-lg">{completedTasks.length}/{tasks.length} Completed</span>
        </div>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Task Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Add Task Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newTask.title}
                  onChange={handleInputChange}
                  placeholder="Complete assignment"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Details about the task..."
                  className="h-20"
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('priority', value)}
                  value={newTask.priority}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => handleSelectChange('category', value)}
                  value={newTask.category}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">
                Add Task
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Categories Management */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Task Categories</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Add New Category</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Work, Personal, etc."
                  />
                  <Button onClick={handleAddCategory}>Add</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Task Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Task Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold">{pendingTasks.length}</div>
                </div>
                
                <div className="bg-secondary p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="text-2xl font-bold">{completedTasks.length}</div>
                </div>
                
                <div className="bg-secondary p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">High Priority</div>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.priority === 'high').length}
                  </div>
                </div>
                
                <div className="bg-secondary p-4 rounded-md">
                  <div className="text-sm text-muted-foreground">Categories</div>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length > 0 ? (
              <ul className="space-y-2">
                {pendingTasks.map(task => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between p-3 rounded-md bg-secondary"
                  >
                    <div className="flex gap-3">
                      <button
                        className="mt-1"
                        onClick={() => handleToggleComplete(task.id)}
                      >
                        <div className="w-5 h-5 rounded-sm border border-primary flex items-center justify-center">
                          {task.completed && <Check className="h-4 w-4 text-primary" />}
                        </div>
                      </button>
                      
                      <div>
                        <div className="font-medium">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-muted-foreground">
                            {task.description}
                          </div>
                        )}
                        <div className="text-xs flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span>{task.priority} priority</span>
                          {task.dueDate && (
                            <>
                              <span>•</span>
                              <span>Due: {formatDate(task.dueDate)}</span>
                            </>
                          )}
                        </div>
                        <Badge variant="outline" className="mt-1">{task.category}</Badge>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id, task.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No pending tasks. Great job!</p>
            )}
          </CardContent>
        </Card>
        
        {/* Completed Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedTasks.length > 0 ? (
              <ul className="space-y-2">
                {completedTasks.map(task => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between p-3 rounded-md bg-secondary/50"
                  >
                    <div className="flex gap-3">
                      <button
                        className="mt-1"
                        onClick={() => handleToggleComplete(task.id)}
                      >
                        <div className="w-5 h-5 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                      </button>
                      
                      <div>
                        <div className="font-medium line-through opacity-70">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-muted-foreground line-through opacity-70">
                            {task.description}
                          </div>
                        )}
                        <Badge variant="outline" className="mt-1 opacity-70">{task.category}</Badge>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTask(task.id, task.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No completed tasks yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default TasksPage;
